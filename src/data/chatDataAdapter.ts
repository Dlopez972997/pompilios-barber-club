import { services } from "./services";
import { team } from "./team";
import type { Service, TeamMember } from "./types";

export type AssistantIntent =
  | "haircut_problem" | "haircut_request" | "beard_problem" | "beard_request"
  | "hair_color" | "nails" | "lashes" | "makeup" | "kids" | "hair_treatment"
  | "general_advice" | "unknown";

export type AssistantContext = {
  intent?: AssistantIntent;
  correctionMode?: boolean;
  topic?: string;
  problemType?: string;
  serviceCategory?: Service["category"];
  desiredResult?: string;
  hairLength?: string;
  hairType?: string;
  previousService?: string;
  urgency?: string;
  selectedProfessionalId?: string;
  selectedServiceId?: string;
};

const roleGroups: Record<AssistantIntent, TeamMember["group"][]> = {
  haircut_problem: ["barberos", "integrales"], haircut_request: ["barberos", "integrales"],
  beard_problem: ["barberos"], beard_request: ["barberos"], hair_color: ["integrales"],
  nails: ["manicuristas"], lashes: ["integrales"], makeup: ["integrales"],
  kids: ["barberos", "integrales"], hair_treatment: ["integrales"],
  general_advice: ["barberos", "integrales", "manicuristas"], unknown: [],
};

const categories: Record<AssistantIntent, Service["category"][]> = {
  haircut_problem: ["barberia", "combos"], haircut_request: ["barberia", "combos", "mujer"],
  beard_problem: ["barberia", "combos"], beard_request: ["barberia", "combos"],
  hair_color: ["color", "mujer"], nails: ["unas", "combos"], lashes: ["pestanas"],
  makeup: ["maquillaje"], kids: ["ninos"], hair_treatment: ["tratamientos", "mujer", "spa"],
  general_advice: ["barberia", "color", "mujer", "tratamientos", "unas"], unknown: [],
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function servicesForIntent(intent: AssistantIntent): Service[] {
  const allowed = categories[intent];
  if (!allowed.length) return [];
  return services.filter((service) => {
    if (!allowed.includes(service.category)) return false;
    const details = normalize(`${service.name} ${service.description}`);
    if (intent === "hair_color") return service.category === "color" || /color|tint|balayage|matizante|raiz|barrido/.test(details);
    if (intent === "hair_treatment") return /cabello|capilar|keratina|hidrat|mascarilla|shampoo|ondulacion/.test(details);
    if (intent === "haircut_request") return service.category !== "mujer" || /corte|cabello|peinad|trenza|despunte/.test(details);
    return true;
  });
}

export function professionalsForIntent(intent: AssistantIntent): TeamMember[] {
  const groups = roleGroups[intent];
  if (!groups.length) return [];
  return team.filter((member) => groups.includes(member.group))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 3);
}

export function getProfessionalFromMessage(message: string): TeamMember | undefined {
  const text = normalize(message);
  return team.find((member) => text.includes(normalize(member.name)) || text.includes(normalize(member.firstName)));
}

export function getServiceFromMessage(message: string): Service | undefined {
  const text = normalize(message);
  return services.find((service) => {
    const name = normalize(service.name);
    const slug = normalize(service.slug.replace(/-/g, " "));
    const explicitName = name.split(" ").length > 1 && text.includes(name);
    const explicitSlug = slug.split(" ").length > 1 && text.includes(slug);
    return text.trim() === name || text.trim() === slug || explicitName || explicitSlug;
  });
}

export function updateAssistantContext(message: string, previous: AssistantContext = {}): AssistantContext {
  const text = normalize(message);
  const mentionedService = getServiceFromMessage(message);
  const professional = getProfessionalFromMessage(message);
  const topic = /barba|bigote/.test(text) ? "barba"
    : /color|tinte|tintura|mechas|balayage|matizante|tono/.test(text) ? "color"
      : /unas|manicure|manicura|pedicure|pedicura/.test(text) ? "unas"
        : /pestana|lifting/.test(text) ? "pestanas"
          : /maquillaje|maquillar/.test(text) ? "maquillaje"
            : /nino|nina|hijo|hija|infantil/.test(text) ? "ninos"
              : /keratina|hidratacion|frizz|reseco|capilar/.test(text) ? "tratamientos"
                : /corte|cabello|pelo|degradado|fade|laterales|hueco/.test(text) ? "cabello" : previous.topic;
  const topicChanged = Boolean(topic && previous.topic && topic !== previous.topic);
  const detectedProblem = /barba.*(disparej|desigual|huec|mal|correg|contorno)|(disparej|desigual|huec).*barba/.test(text) ? "barba desigual"
    : /color.*(no me gusto|no me gusta|quedo mal|muy claro|muy oscuro)|(no me gusto|no me gusta).*color/.test(text) ? "color no deseado"
      : /degradad|fade|huec|transicion|muy alto|mas alto/.test(text) && topic === "cabello" ? "degradado desigual"
        : /disparej|desigual|un lado|asimetr/.test(text) ? topic === "barba" ? "barba desigual" : "resultado desigual"
          : /muy corto|demasiado corto|cortaron demasiado/.test(text) ? "corte demasiado corto"
            : /mal corte|cortaron mal|me cortaron mal/.test(text) ? "corrección de corte"
              : /reseco|cabello seco|pelo seco|frizz/.test(text) ? "cabello seco" : undefined;
  const desiredResult = /clasico/.test(text) ? "estilo clásico"
    : /moderno|actual/.test(text) ? "estilo moderno"
      : /facil de mantener|bajo mantenimiento/.test(text) ? "fácil mantenimiento"
        : /cambio notable|cambio radical/.test(text) ? "cambio notable"
          : /cuidar|mantener/.test(text) && /barba/.test(text) ? "mantenimiento de barba" : previous.desiredResult;
  const hairLength = /largo|larga|largo/.test(text) ? "largo"
    : /corto|corta/.test(text) ? "corto" : previous.hairLength;
  const hairType = /rizado|crespo|ondulado|liso|afro/.exec(text)?.[0] ?? previous.hairType;
  const previousService = /despues de|despues del|me hicieron|me realizaron/.test(text) ? mentionedService?.name ?? previous.previousService : previous.previousService;
  const urgency = /hoy|urgente|lo antes posible/.test(text) ? "El cliente expresó urgencia" : previous.urgency;
  const categoryMention = /barba/.test(text) ? "barberia"
    : /unas?|manicure|manicura|pedicure|pedicura/.test(text) ? "unas"
      : /color|tinte|mechas|balayage/.test(text) ? "color"
        : /nino|nina|hijo|hija|infantil/.test(text) ? "ninos"
          : /corte|cabello|pelo|degradado|fade/.test(text) ? "barberia" : previous.serviceCategory;
  const correctionMode = /corregir un servicio|arreglar un servicio|me hicieron algo/.test(text) ? true : previous.correctionMode;
  const explicitNewTopic = /barba|bigote|color|tinte|tintura|mechas|balayage|unas|manicure|manicura|pedicure|pedicura|pestana|maquillaje|nino|nina|hijo|hija|corte|cabello|pelo|keratina|hidratacion/.test(text);
  const specificProblem = /mal corte|cortaron mal|me cortaron mal|mal degrad|degradad|fade|huec|disparej|desigual|muy corto|demasiado corto|mas alto|color no deseado|no me gusto|no me gusta|barba.*(mal|correg|disparej|huec)/.test(text);
  const resetPreviousRecommendation = topicChanged || (explicitNewTopic && !specificProblem);
  const problemType = detectedProblem ?? (resetPreviousRecommendation ? undefined : previous.problemType);
  const resolvedDesiredResult = /clasico|moderno|actual|facil de mantener|bajo mantenimiento|cambio notable|cambio radical|cuidar|mantener/.test(text) ? desiredResult
    : resetPreviousRecommendation ? undefined : desiredResult;
  return {
    ...previous,
    ...(correctionMode !== undefined ? { correctionMode } : {}),
    ...(topic ? { topic } : {}),
    ...(problemType !== undefined ? { problemType } : resetPreviousRecommendation ? { problemType: undefined } : {}),
    ...(resetPreviousRecommendation ? { selectedServiceId: undefined } : {}),
    ...(resolvedDesiredResult !== undefined ? { desiredResult: resolvedDesiredResult } : resetPreviousRecommendation ? { desiredResult: undefined } : {}),
    ...(hairLength ? { hairLength } : {}),
    ...(hairType ? { hairType } : {}),
    ...(previousService ? { previousService } : {}),
    ...(urgency ? { urgency } : {}),
    ...(categoryMention ? { serviceCategory: categoryMention } : {}),
    ...(mentionedService ? { selectedServiceId: mentionedService.id } : {}),
    ...(professional ? { selectedProfessionalId: professional.id } : {}),
  };
}
