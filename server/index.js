import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4100);
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
const bodyLimit = 7 * 1024 * 1024;
const requestsByIp = new Map();
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const safetyPattern = /\b(sangra(?:ndo)?|no para de sangrar|herida importante|corte profundo|infecci[oó]n|pus|quemadura|inflamaci[oó]n importante|lesi[oó]n|dolor intenso)\b/i;
const catalog = JSON.parse(await readFile(resolve(root, "server/advisor-catalog.json"), "utf8"));
const servicesById = new Map(catalog.services.map((item) => [item.id, item]));
const professionalsById = new Map(catalog.professionals.map((item) => [item.id, item]));
const serviceIds = catalog.services.map(({ id }) => id);
const professionalIds = catalog.professionals.map(({ id }) => id);
const allowedOrigins = new Set(["http://localhost:5173", "http://127.0.0.1:5173", ...(process.env.STYLE_ADVISOR_ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean)]);

const schema = {
  type: "object", additionalProperties: false,
  properties: {
    action: { type: "string", enum: ["ASK_FOLLOWUP", "RECOMMEND", "BOOK", "ESCALATE"] },
    message: { type: "string" }, question: { type: ["string", "null"] },
    quickReplies: { type: "array", items: { type: "string" } }, tips: { type: "array", items: { type: "string" } },
    recommendedServiceIds: { type: "array", items: { type: "string", enum: serviceIds } },
    recommendedProfessionalIds: { type: "array", items: { type: "string", enum: professionalIds } },
    recommendationReason: { type: ["string", "null"] }, offerImageUpload: { type: "boolean" }, safetyEscalation: { type: "boolean" },
    visualContext: { type: ["object", "null"], additionalProperties: false, properties: {
      hairLength: { type: ["string", "null"] }, visibleStyle: { type: ["string", "null"] }, beardPresent: { type: ["boolean", "null"] },
      beardLength: { type: ["string", "null"] }, visibleColor: { type: ["string", "null"] }, visibleConcerns: { type: "array", items: { type: "string" } }, confidence: { type: ["number", "null"] },
    }, required: ["hairLength", "visibleStyle", "beardPresent", "beardLength", "visibleColor", "visibleConcerns", "confidence"] },
  },
  required: ["action", "message", "question", "quickReplies", "tips", "recommendedServiceIds", "recommendedProfessionalIds", "recommendationReason", "offerImageUpload", "safetyEscalation", "visualContext"],
};

const systemPrompt = `Eres Pompilio's Style Advisor, asesor de estilo amable, prudente y experto para un atelier de peluquería y barbería. Responde siempre en español natural, cálido y conciso. No eres FAQ: mantén el contexto, descubre primero el problema, objetivo, largo actual o mantenimiento, y formula normalmente UNA pregunta concreta por turno. No recomiendes un servicio hasta tener contexto suficiente; si falta, action=ASK_FOLLOWUP y no devuelvas IDs. En problemas de corte/barba/color, indaga detalle y preferencia antes de recomendar. Después ofrece una orientación tentativa y consejo seguro. Para descubrir estilo, pregunta objetivo, largo y mantenimiento a lo largo de turnos. Para color correctivo, aconseja valoración profesional; nunca des recetas químicas. Solo recomienda IDs disponibles en el catálogo y profesionales compatibles por categoría/grupo/especialidades; nunca afirmes disponibilidad. No inventes precios, duración, ratings, servicios, profesionales ni URL. No prometas resultados. Las fotos son contexto opcional: describe solo rasgos visibles pertinentes de cabello/barba/estilo; no identifiques personas ni infieras edad, etnia, salud u otros atributos sensibles. No hagas diagnóstico médico. Si el usuario describe o la foto parece mostrar lesión, sangrado persistente, quemadura, infección o inflamación importante, usa ESCALATE sin recomendaciones cosméticas y sugiere valoración sanitaria prudente. offerImageUpload solo cuando una foto podría ayudar y no se haya enviado una. Las quickReplies deben ser breves y útiles (3-5). Usa las funciones para confirmar datos reales.`;

function sendJson(res, status, value, headers = {}) { res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...headers }); res.end(JSON.stringify(value)); }
function cors(origin) { return !origin ? {} : allowedOrigins.has(origin) ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" } : null; }
function limited(ip) {
  const now = Date.now(), old = requestsByIp.get(ip);
  if (!old || now - old.startedAt > 60_000) { requestsByIp.set(ip, { startedAt: now, count: 1 }); return false; }
  old.count += 1; return old.count > 18;
}
function readBody(req) { return new Promise((resolveBody, reject) => {
  let raw = "";
  req.on("data", (chunk) => { raw += chunk; if (Buffer.byteLength(raw) > bodyLimit) { reject(Object.assign(new Error("payload too large"), { status: 413 })); req.destroy(); } });
  req.on("end", () => { try { resolveBody(JSON.parse(raw || "{}")); } catch { reject(Object.assign(new Error("invalid json"), { status: 400 })); } });
  req.on("error", reject);
}); }
function validateImage(image) {
  if (!image) return null;
  if (typeof image.dataUrl !== "string" || !allowedImageTypes.has(image.mimeType)) throw Object.assign(new Error("invalid image"), { status: 400 });
  const match = image.dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || match[1] !== image.mimeType) throw Object.assign(new Error("invalid image"), { status: 400 });
  const data = Buffer.from(match[2], "base64");
  if (!data.length || data.length > 5 * 1024 * 1024) throw Object.assign(new Error("image too large"), { status: 413 });
  return image.dataUrl;
}
function cleanHistory(history) { return Array.isArray(history) ? history.slice(-16).filter((entry) => entry && ["user", "assistant"].includes(entry.role) && typeof entry.text === "string").map(({ role, text }) => ({ role, content: text.slice(0, 800) })) : []; }
function toolDefinitions() { return [
  { type: "function", name: "getServices", description: "Consulta los servicios reales y filtra por categoría o texto.", strict: true, parameters: { type: "object", properties: { category: { type: ["string", "null"] }, query: { type: ["string", "null"] } }, required: ["category", "query"], additionalProperties: false } },
  { type: "function", name: "getServiceById", description: "Obtiene un servicio real por ID.", strict: true, parameters: { type: "object", properties: { id: { type: "string", enum: serviceIds } }, required: ["id"], additionalProperties: false } },
  { type: "function", name: "getProfessionals", description: "Consulta profesionales reales por grupo y especialidad.", strict: true, parameters: { type: "object", properties: { group: { type: ["string", "null"] }, query: { type: ["string", "null"] } }, required: ["group", "query"], additionalProperties: false } },
  { type: "function", name: "getProfessionalById", description: "Obtiene un profesional real por ID.", strict: true, parameters: { type: "object", properties: { id: { type: "string", enum: professionalIds } }, required: ["id"], additionalProperties: false } },
]; }
function runTool(name, args) {
  const q = String(args.query || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (name === "getServices") return catalog.services.filter((item) => (!args.category || item.category === args.category) && (!q || `${item.name} ${item.description} ${item.category}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(q))).slice(0, 30);
  if (name === "getServiceById") return servicesById.get(args.id) || null;
  if (name === "getProfessionals") return catalog.professionals.filter((item) => (!args.group || item.group === args.group) && (!q || `${item.name} ${item.role} ${(item.specialties || []).join(" ")}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(q))).slice(0, 30);
  if (name === "getProfessionalById") return professionalsById.get(args.id) || null;
  return null;
}
function validateResult(value) {
  const serviceIds = [...new Set((value.recommendedServiceIds || []).filter((id) => servicesById.has(id)))].slice(0, 2);
  const compatibleGroups = new Set(serviceIds.flatMap((id) => {
    const category = servicesById.get(id).category;
    if (["barberia", "combos"].includes(category)) return ["barberos", ...(category === "barberia" ? ["integrales"] : [])];
    if (category === "unas") return ["manicuristas"];
    if (["color", "mujer", "pestanas", "maquillaje", "spa", "tratamientos", "depilacion"].includes(category)) return ["integrales"];
    if (category === "ninos") return ["barberos", "integrales"];
    return [];
  }));
  const professionalIds = [...new Set((value.recommendedProfessionalIds || []).filter((id) => professionalsById.has(id) && compatibleGroups.has(professionalsById.get(id).group)))].slice(0, 3);
  const v = value.visualContext;
  const visualContext = v && typeof v === "object" ? {
    hairLength: typeof v.hairLength === "string" ? v.hairLength.slice(0, 40) : null, visibleStyle: typeof v.visibleStyle === "string" ? v.visibleStyle.slice(0, 120) : null,
    beardPresent: typeof v.beardPresent === "boolean" ? v.beardPresent : null, beardLength: typeof v.beardLength === "string" ? v.beardLength.slice(0, 40) : null,
    visibleColor: typeof v.visibleColor === "string" ? v.visibleColor.slice(0, 80) : null, visibleConcerns: Array.isArray(v.visibleConcerns) ? v.visibleConcerns.filter((x) => typeof x === "string").slice(0, 5).map((x) => x.slice(0, 120)) : [],
    confidence: Number.isFinite(v.confidence) ? Math.max(0, Math.min(1, v.confidence)) : null,
  } : null;
  const action = ["ASK_FOLLOWUP", "RECOMMEND", "BOOK", "ESCALATE"].includes(value.action) ? value.action : "ASK_FOLLOWUP";
  const recommendation = ["RECOMMEND", "BOOK"].includes(action) && serviceIds.length > 0;
  return {
    action: value.safetyEscalation || action === "ESCALATE" ? "ESCALATE" : recommendation ? action : "ASK_FOLLOWUP",
    message: typeof value.message === "string" ? value.message.slice(0, 1200) : "Cuéntame un poco más para orientarte mejor.", question: typeof value.question === "string" ? value.question.slice(0, 300) : null,
    quickReplies: Array.isArray(value.quickReplies) ? value.quickReplies.filter((x) => typeof x === "string").slice(0, 5).map((x) => x.slice(0, 80)) : [],
    tips: Array.isArray(value.tips) ? value.tips.filter((x) => typeof x === "string").slice(0, 2).map((x) => x.slice(0, 300)) : [],
    recommendedServiceIds: recommendation ? serviceIds : [], recommendedProfessionalIds: recommendation ? professionalIds : [],
    recommendationReason: recommendation && typeof value.recommendationReason === "string" ? value.recommendationReason.slice(0, 400) : null,
    offerImageUpload: Boolean(value.offerImageUpload) && !visualContext, safetyEscalation: Boolean(value.safetyEscalation) || action === "ESCALATE", visualContext,
  };
}
async function askAgent(body, image) {
  const directory = JSON.stringify({ services: catalog.services.map(({ id, name, category, description }) => ({ id, name, category, description })), professionals: catalog.professionals.map(({ id, name, role, group, rating, specialties }) => ({ id, name, role, group, rating, specialties })) });
  const context = body.context && typeof body.context === "object" ? JSON.stringify(body.context).slice(0, 3000) : "{}";
  const content = [{ type: "input_text", text: `Contexto de sesión: ${context}\n\nMensaje actual: ${String(body.message || "").slice(0, 500)}\n\nDirectorio real del negocio: ${directory}\n\nUsa las funciones cuando debas confirmar información.` }];
  if (image) content.push({ type: "input_image", image_url: image, detail: "auto" });
  let input = [{ role: "system", content: systemPrompt }, ...cleanHistory(body.history), { role: "user", content }];
  const request = { model, store: false, max_output_tokens: 1200, tools: toolDefinitions(), tool_choice: "auto", parallel_tool_calls: false, text: { format: { type: "json_schema", name: "style_advisor_response", strict: true, schema } } };
  for (let pass = 0; pass < 3; pass += 1) {
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ ...request, input }), signal: AbortSignal.timeout(45_000) });
    if (!response.ok) throw Object.assign(new Error(`provider_${response.status}`), { status: 502 });
    const result = await response.json();
    const calls = (result.output || []).filter((item) => item.type === "function_call");
    if (calls.length) {
      const outputs = calls.map((call) => ({ type: "function_call_output", call_id: call.call_id, output: JSON.stringify(runTool(call.name, JSON.parse(call.arguments || "{}"))) }));
      input = [...input, ...(result.output || []), ...outputs];
      continue;
    }
    if (!result.output_text) throw Object.assign(new Error("empty response"), { status: 502 });
    return validateResult(JSON.parse(result.output_text));
  }
  throw Object.assign(new Error("tool limit"), { status: 502 });
}

createServer(async (req, res) => {
  const headers = cors(req.headers.origin);
  if (headers === null) return sendJson(res, 403, { error: "origin_not_allowed" });
  if (req.method === "OPTIONS") { res.writeHead(204, headers); return res.end(); }
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (req.method === "GET" && url.pathname === "/api/health") return sendJson(res, 200, { ok: true, configured: Boolean(process.env.OPENAI_API_KEY) }, headers);
  if (req.method !== "POST" || url.pathname !== "/api/style-advisor") return sendJson(res, 404, { error: "not_found" }, headers);
  const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() || req.socket.remoteAddress || "unknown";
  const now = Date.now(), record = requestsByIp.get(ip);
  if (!record || now - record.startedAt > 60_000) requestsByIp.set(ip, { startedAt: now, count: 1 });
  else { record.count += 1; if (record.count > 18) return sendJson(res, 429, { error: "rate_limited" }, headers); }
  try {
    const body = await readBody(req);
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";
    const image = validateImage(body.image);
    if (safetyPattern.test(message)) return sendJson(res, 200, validateResult({ action: "ESCALATE", message: "Siento que te esté pasando. Si hay sangrado persistente, una herida importante, quemadura, infección o dolor intenso, detén el cuidado cosmético y busca valoración sanitaria. No intentes corregirlo con un servicio de salón.", safetyEscalation: true }), headers);
    if (!process.env.OPENAI_API_KEY) return sendJson(res, 503, { error: "advisor_unavailable", fallbackMessage: "Ahora mismo no pude completar el análisis. Puedes seguir explorando nuestros servicios o hablar con nosotros por WhatsApp." }, headers);
    return sendJson(res, 200, await askAgent({ ...body, message }, image), headers);
  } catch (error) {
    const status = error.status || 502;
    return sendJson(res, status, { error: status === 413 ? "payload_too_large" : status === 400 ? "invalid_request" : "advisor_unavailable", fallbackMessage: "Ahora mismo no pude completar el análisis. Puedes seguir explorando nuestros servicios o hablar con nosotros por WhatsApp." }, headers);
  }
}).listen(port, "0.0.0.0", () => console.log(`Style Advisor API listening on ${port}`));
