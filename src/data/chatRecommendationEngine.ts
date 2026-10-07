import type { Service, TeamMember } from "./types";
import { getProfessionalFromMessage, professionalsForIntent, servicesForIntent, type AssistantContext, type AssistantIntent } from "./chatDataAdapter";
import { getStyleTip } from "./chatTipEngine";

export type AssistantRecommendation = {
  intent: AssistantIntent;
  response: string;
  followUpOptions?: string[];
  services: Service[];
  professionals: TeamMember[];
  tip?: string;
  consultationLabel?: string;
  consultationValue?: string;
  safe: boolean;
  unmatched: boolean;
};

const healthConcernPattern = /\b(herid|cortad|sangr|infect|pus|quemad|reaccion fuerte|alergia fuerte|dolor intenso|me duele mucho|lesion|inflamacion importante|ampolla)\w*/i;
const haircutIssuePattern = /\b(mal corte|cortaron mal|me cortaron mal|cortaron demasiado|me dejaron|me hicieron un hueco|hueco atras|hueco en|degradad|fade|disparej|desigual|muy corto|demasiado corto|muy alto|quedo alto|no me favorece|no me gusta como quedo)\w*/i;
const haircutDetailPattern = /\b(huec|degradad|fade|transicion|disparej|desigual|muy corto|demasiado corto|muy alto|mas alto|quedo alto|no me favorece)\w*/i;
const beardDetailPattern = /\b(disparej|desigual|contorno|huec|largo|marcacion|perfilad)\w*/i;
const beardIssuePattern = /\b(barba|bigote)\w*.*\b(mal|disparej|desigual|error|arreglar|corregir|problema|quedo|hueco|contorno)\w*|\b(mal|disparej|desigual|hueco)\w*.*\b(barba|bigote)\w*/i;
const colorIssuePattern = /\b(color|tinte|tintura|tono|mechas|balayage|raiz|matizante|decoloracion)\w*/i;

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function detectAssistantIntent(message: string): AssistantIntent {
  const text = normalize(message);
  if (/\b(herid|cortad|sangr|infect|pus|quemad|reaccion fuerte|dolor intenso|me duele mucho|inflamacion importante)\w*/.test(text)) return "unknown";
  if (/\b(nino|nina|hijo|hija|chiquit|infantil|bebe)\w*/.test(text)) return "kids";
  if (/no se que|no se cual|no estoy seguro|no estoy segura|cambiar de estilo|cambio de estilo|asesoria|asesorame/.test(text)) return "general_advice";
  if (haircutIssuePattern.test(text) && !/barba/.test(text) && !colorIssuePattern.test(text)) return "haircut_problem";
  if (/\b(barba|bigote)\b/.test(text)) return beardIssuePattern.test(text) ? "beard_problem" : "beard_request";
  if (/\b(unas?|manicure|manicura|pedicure|pedicura|esmalte|poligel|acrilic)\w*/.test(text)) return "nails";
  if (/\b(pestana|pestanas|lifting)\w*/.test(text)) return "lashes";
  if (/\b(maquillaje|maquillar)\w*/.test(text)) return "makeup";
  if (colorIssuePattern.test(text)) return "hair_color";
  if (/\b(tratamiento|hidratacion|keratina|frizz|reseco|resequedad|rescate|capilar|cabello seco|pelo seco)\w*/.test(text)) return "hair_treatment";
  if (/\b(corte|cortar|cortaron|cabello|pelo|degradado|fade|laterales)\w*/.test(text)) return /\b(mal|disparej|desigual|error|arreglar|corregir|problema|quedo|corto|alto)\w*/.test(text) ? "haircut_problem" : "haircut_request";
  if (/\b(corregir un servicio|arreglar un servicio|me hicieron algo|corregir)\b/.test(text)) return "unknown";
  if (/clasico|moderno|facil de mantener|bajo mantenimiento|cambio notable/.test(text)) return "general_advice";
  return "unknown";
}

function scoreService(service: Service, intent: AssistantIntent, message: string, context: AssistantContext) {
  const details = normalize(`${service.name} ${service.description} ${service.category}`);
  const words = normalize(message).split(/[^a-z0-9]+/).filter((word) => word.length > 2);
  let score = words.reduce((total, word) => total + (details.includes(word) ? 3 : 0), 0);
  if (service.featured) score += 1;
  if (service.popular) score += 1;
  if (intent === "haircut_problem" || intent === "haircut_request") {
    if (/corte|barberia/.test(details)) score += 7;
    if (/barba/.test(details) && !/corte/.test(details)) score -= 5;
  }
  if (intent === "beard_problem" || intent === "beard_request") {
    if (/barba/.test(details)) score += 9;
    if (/^barba(?:\s|$)/.test(normalize(service.name))) score += 4;
  }
  if (intent === "hair_color" && /color|tint|balayage|raiz|matizante|barrido|mechas/.test(details)) score += 10;
  if (intent === "hair_color" && /no me gusto|no me gusta|correg|muy claro|muy oscuro|tono/.test(normalize(message))) {
    if (/barrido|matizante|correccion/.test(details)) score += 18;
    if (/balayage/.test(details)) score -= 2;
  }
  if (intent === "hair_color" && context.hairLength === "corto" && /balayage.*corto|corto.*balayage/.test(details)) score += 12;
  if (intent === "nails" && /manicure|pedicure|unas|esmalte/.test(details)) score += 10;
  if (intent === "kids" && service.category === "ninos") score += 12;
  if (intent === "lashes" && /pestana/.test(details)) score += 10;
  if (intent === "makeup" && /maquillaje/.test(details)) score += 10;
  if (intent === "hair_treatment" && /capilar|hidratacion|keratina|cabello|shampoo/.test(details)) score += 8;
  if (intent === "haircut_request" && context.hairType && details.includes(normalize(context.hairType))) score += 4;
  if (context.selectedServiceId === service.id) score += 30;
  if (context.desiredResult && details.includes(normalize(context.desiredResult))) score += 3;
  return score;
}

function consultation(intent: AssistantIntent, context: AssistantContext) {
  if (context.problemType) return { consultationLabel: "TU CONSULTA", consultationValue: context.problemType };
  const labels: Partial<Record<AssistantIntent, string>> = {
    haircut_problem: "Corrección de corte", haircut_request: "Corte y estilo", beard_problem: "Corrección de barba",
    beard_request: "Cuidado de barba", hair_color: "Color", nails: "Cuidado de uñas", lashes: "Pestañas",
    makeup: "Maquillaje", kids: "Servicio infantil", hair_treatment: "Cuidado capilar", general_advice: "Asesoría de estilo",
  };
  return labels[intent] ? { consultationLabel: "TU OBJETIVO", consultationValue: labels[intent] } : {};
}

export function recommendStyleService(message: string, context: AssistantContext = {}): AssistantRecommendation {
  const text = normalize(message);
  if (healthConcernPattern.test(text)) {
    return { intent: context.intent ?? "unknown", response: "Siento que te haya pasado. Si hay herida, sangrado, dolor intenso, quemadura o una reacción fuerte, detén el cuidado cosmético y busca valoración de un profesional de salud. No intentes corregirlo en el salón mientras haya esos síntomas.", services: [], professionals: [], safe: false, unmatched: false };
  }

  const detected = detectAssistantIntent(message);
  const intent = context.correctionMode ? context.intent ?? detected : detected === "unknown" ? context.intent ?? "unknown" : detected;
  const serviceMention = /corregir un servicio|arreglar un servicio|me hicieron algo/.test(text);
  if (serviceMention) {
    return { intent: "unknown", response: "Claro, te ayudo a ubicarlo. ¿Qué servicio quieres revisar?", followUpOptions: ["Corte", "Barba", "Color", "Uñas", "Otro"], services: [], professionals: [], safe: true, unmatched: false };
  }

  if (context.correctionMode && /^(corte|barba|color|unas)$/.test(text)) {
    const questions: Partial<Record<AssistantIntent, { response: string; options: string[] }>> = {
      haircut_problem: { response: "¿Qué fue lo que más te molestó del corte?", options: ["Quedó disparejo", "Muy corto", "Mal degradado", "No me favorece", "Otro"] },
      beard_problem: { response: "¿Qué necesitas corregir principalmente?", options: ["Perfilado disparejo", "Largo", "Contorno", "Otro"] },
      hair_color: { response: "¿Qué es lo que quieres revisar del color?", options: ["Quedó muy claro", "Quedó muy oscuro", "No me gustó el tono", "Otro"] },
      nails: { response: "¿Qué detalle de tus uñas quieres revisar?", options: ["Forma", "Color", "Mantenimiento", "Otro"] },
    };
    const prompt = questions[intent];
    if (prompt) return { intent, response: prompt.response, followUpOptions: prompt.options, services: [], professionals: [], safe: true, unmatched: false, ...consultation(intent, context) };
  }

  if (text === "otro" && context.correctionMode) {
    return { intent: context.intent ?? "unknown", response: "Cuéntame con tus palabras qué te gustaría corregir.", services: [], professionals: [], safe: true, unmatched: false, ...consultation(intent, context) };
  }

  if (text === "otro" && (intent === "haircut_problem" || intent === "beard_problem")) {
    return { intent, response: "Cuéntame con tus palabras qué detalle quieres revisar y te oriento.", services: [], professionals: [], safe: true, unmatched: false, ...consultation(intent, context) };
  }

  if (intent === "unknown") {
    return { intent, response: "Puedo orientarte con los servicios y profesionales que tenemos. ¿Qué te interesa hoy?", followUpOptions: ["Corte", "Barba", "Color", "Uñas", "Niños", "Corregir un servicio", "Quiero asesoría"], services: [], professionals: [], safe: true, unmatched: false };
  }

  if (intent === "general_advice") {
    const hasStylePreference = Boolean(context.desiredResult || /clasico|moderno|facil de mantener|bajo mantenimiento|cambio notable/.test(text));
    return {
      intent,
      response: hasStylePreference ? `Entiendo: buscas ${context.desiredResult ?? "un cambio de estilo"}. ¿Qué servicio quieres explorar primero?` : "Perfecto. ¿Qué resultado te gustaría conseguir?",
      followUpOptions: hasStylePreference ? ["Cabello", "Barba", "Color", "Uñas"] : ["Algo clásico", "Más moderno", "Fácil de mantener", "Un cambio notable"],
      services: [], professionals: [], safe: true, unmatched: false,
      ...consultation(intent, context),
    };
  }

  if (intent === "haircut_problem" && !haircutDetailPattern.test(text)) {
    return { intent, response: "Te ayudo a revisarlo. ¿Qué fue lo que más te molestó?", followUpOptions: ["Quedó disparejo", "Muy corto", "Mal degradado", "No me favorece", "Otro"], services: [], professionals: [], safe: true, unmatched: false, ...consultation(intent, context) };
  }
  if (intent === "beard_problem" && !beardDetailPattern.test(text)) {
    return { intent, response: "Claro. ¿Qué necesitas corregir principalmente?", followUpOptions: ["Perfilado", "Largo", "Contorno", "Otro"], services: [], professionals: [], safe: true, unmatched: false, ...consultation(intent, context) };
  }
  if (intent === "hair_treatment" && !/hidratacion|keratina|frizz|reseco|resequedad|ondulacion|mascarilla|shampoo/.test(text)) {
    return { intent, response: "Para orientarte mejor, ¿qué te gustaría mejorar principalmente?", followUpOptions: ["Hidratación", "Keratina", "Frizz", "Forma y textura"], services: [], professionals: [], safe: true, unmatched: false, ...consultation(intent, context) };
  }
  if (intent === "hair_color" && /no me gusto|no me gusta|quedo mal|correg/.test(text) && !/muy claro|muy oscuro|tono.*(naranja|verde|amarillo|rojo)|raiz|decolor/.test(text)) {
    return { intent, response: "Para no sugerirte un servicio equivocado, ¿qué fue lo que menos te gustó del resultado?", followUpOptions: ["Quedó muy claro", "Quedó muy oscuro", "El tono quedó distinto", "Otro"], services: [], professionals: [], safe: true, unmatched: false, ...consultation(intent, context) };
  }
  if (intent === "hair_color" && /^(color|quiero cambiar mi color|quiero cambiar el color|tinte)$/.test(text)) {
    return { intent, response: "¿Qué te gustaría conseguir con el color?", followUpOptions: ["Cubrir raíces", "Un cambio sutil", "Aclarar con mechas", "Corregir un tono"], services: [], professionals: [], safe: true, unmatched: false, ...consultation(intent, context) };
  }
  if (intent === "haircut_request" && !context.desiredResult && !/\b(corte|cortar|cabello|pelo|degradado|fade|laterales)\b/.test(text)) {
    return { intent, response: "Para recomendarte un estilo que puedas mantener, ¿qué buscas?", followUpOptions: ["Algo clásico", "Más moderno", "Fácil de mantener", "Un cambio notable"], services: [], professionals: [], safe: true, unmatched: false, ...consultation(intent, context) };
  }

  const candidates = servicesForIntent(intent)
    .map((service) => ({ service, score: scoreService(service, intent, message, context) }))
    .sort((a, b) => b.score - a.score);
  const best = candidates[0]?.service;
  const eligiblePros = professionalsForIntent(intent);
  if (!best) {
    return { intent, response: "No encuentro una opción específica en el catálogo para eso. El equipo puede orientarte sobre el servicio adecuado.", services: [], professionals: [], safe: true, unmatched: true, ...consultation(intent, context) };
  }

  let response: string;
  if (intent === "haircut_problem") response = "Por lo que describes, parece un tema de forma o transición. El equipo puede revisar si basta con ajustar esa zona.";
  else if (intent === "beard_problem") response = "Por lo que cuentas, parece que conviene revisar el contorno y el equilibrio de la barba.";
  else if (intent === "hair_color" && /no me gusto|no me gusta|quedo|correg/.test(text)) response = "Entiendo; antes de aplicar otro producto, conviene que un profesional revise el tono y el estado del cabello.";
  else if (intent === "hair_treatment") response = "Para el cabello seco o con frizz, conviene revisar su estado y elegir el cuidado apropiado en el salón.";
  else if (intent === "kids" && /corte|cortar/.test(text)) response = "El catálogo tiene opciones infantiles, aunque no especifica un corte infantil. Puedes consultar con el equipo si pueden atender el estilo que buscas.";
  else response = `Encontré una opción del catálogo relacionada con ${intent === "beard_request" ? "el cuidado de barba" : intent === "hair_color" ? "color" : intent === "nails" ? "uñas" : intent === "kids" ? "servicios infantiles" : "lo que buscas"}.`;

  const explicitlyMentionedProfessional = getProfessionalFromMessage(message);
  const mentionedProfessional = explicitlyMentionedProfessional ?? eligiblePros.find((member) => member.id === context.selectedProfessionalId);
  const professionals = mentionedProfessional && eligiblePros.some((member) => member.id === mentionedProfessional.id)
    ? [mentionedProfessional, ...eligiblePros.filter((member) => member.id !== mentionedProfessional.id)].slice(0, 2)
    : eligiblePros.slice(0, 2);
  if (explicitlyMentionedProfessional && !eligiblePros.some((member) => member.id === explicitlyMentionedProfessional.id)) {
    response += ` ${explicitlyMentionedProfessional.name} figura en el equipo como ${explicitlyMentionedProfessional.role}; te muestro perfiles compatibles con este servicio.`;
  }

  const topic = consultation(intent, context);
  return {
    intent,
    response,
    services: [best],
    professionals,
    tip: getStyleTip(intent, message, context),
    safe: true,
    unmatched: false,
    ...topic,
  };
}
