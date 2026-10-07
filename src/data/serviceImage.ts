import type { Service } from "./types";
import { serviceImageMap } from "./serviceCatalogPhotos";

const skipWords = new Set(["y", "de", "del", "la", "el", "los", "las", "con", "en", "a", "o", "un", "una"]);

export function serviceInitials(name: string) {
  const words = name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const relevant = words.filter((word) => !skipWords.has(word.toLowerCase()));
  const chosen = (relevant.length > 0 ? relevant : words).slice(0, 3);
  return chosen.map((word) => word[0].toUpperCase()).join("");
}

/** Each service's image comes only from its explicit ID assignment; missing photos stay empty. */
export function resolveServiceImage(service: Pick<Service, "id">) {
  const assignment = serviceImageMap[service.id];
  if (assignment === undefined) {
    throw new Error(`No existe una asignación visual para el servicio "${service.id}".`);
  }
  return assignment;
}
