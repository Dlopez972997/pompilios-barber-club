import type { AssistantContext, AssistantIntent } from "./chatDataAdapter";

type TipRule = {
  test: RegExp;
  tip: string;
};

const haircutTips: TipRule[] = [
  { test: /degradad|fade|transicion|alto|hueco|huec|disparej|desigual|lado|asimetr/, tip: "Evita retocarlo con máquina en casa; dejar crecer un poco la zona más corta puede facilitar una corrección más natural." },
  { test: /corto|demasiado/, tip: "Dale unos días de crecimiento antes de decidir otro cambio; mientras tanto, prueba peinarlo con un producto ligero." },
  { test: /favore|estilo|clasico|moderno|manten/, tip: "Piensa cuánto tiempo quieres dedicar al peinado diario; ese detalle ayuda a elegir un corte que encaje contigo." },
];

const tips: Partial<Record<AssistantIntent, TipRule[]>> = {
  haircut_problem: haircutTips,
  haircut_request: [{ test: /.*/, tip: "Una foto de referencia y contar cuánto tiempo quieres dedicar al peinado ayuda a definir el resultado antes de empezar." }],
  beard_problem: [
    { test: /disparej|desigual|contorno|marcacion|hueco/, tip: "Evita seguir perfilando la zona más alta por tu cuenta; dejar crecer el contorno unos días ayuda a equilibrar la forma." },
    { test: /.*/, tip: "Hidrata la barba y péinala en la dirección de crecimiento; evita perfilarla de nuevo mientras decides la forma." },
  ],
  beard_request: [{ test: /.*/, tip: "Para mantener la forma, hidrata y peina la barba a diario; la frecuencia del retoque depende del largo que prefieras." }],
  hair_color: [
    { test: /no me gusto|no me gusta|quedo|quedo mal|muy claro|muy oscuro|naranja|verde|correg/, tip: "No intentes corregir el tono con mezclas caseras. Reduce el calor y consulta al equipo antes de aplicar otro producto." },
    { test: /.*/, tip: "Después de color, evita lavados excesivos y calor alto; usa productos adecuados para cabello tratado." },
  ],
  nails: [{ test: /.*/, tip: "Hidrata manos y cutículas, y evita usar las uñas como herramienta; el mantenimiento depende del servicio que elijas." }],
  lashes: [{ test: /.*/, tip: "Evita frotar los ojos y sigue las indicaciones del servicio para cuidar mejor el resultado." }],
  makeup: [{ test: /.*/, tip: "Una referencia del acabado que buscas ayuda a personalizar el maquillaje para la ocasión." }],
  kids: [{ test: /.*/, tip: "Una foto del estilo y contar cómo suele llevar el cabello ayuda a acordar un resultado cómodo para el niño." }],
  hair_treatment: [
    { test: /reseco|seco|deshidrat|frizz/, tip: "Reduce el calor y usa acondicionador adecuado; evita aplicar tratamientos químicos sin revisar antes el cabello." },
    { test: /.*/, tip: "Cuéntale al profesional qué productos usas y cuándo fue tu último tratamiento para orientar el cuidado." },
  ],
};

export function getStyleTip(intent: AssistantIntent, message: string, context?: AssistantContext) {
  const normalized = `${message} ${context?.problemType ?? ""} ${context?.desiredResult ?? ""}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (intent === "haircut_request" && context?.hairType) {
    return `Para cabello ${context.hairType}, comparte una referencia y cuéntale al profesional cuánto quieres peinarlo cada día.`;
  }
  return tips[intent]?.find((rule) => rule.test.test(normalized))?.tip;
}
