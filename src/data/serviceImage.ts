import { images } from "../assets/images";
import color from "../assets/gallery/reel-dy-c.jpg";
import type { Service, ServiceCategory } from "./types";

const gallery = {
  color,
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

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
  const chosen = (relevant.length > 0 ? relevant : words).slice(0, 4);
  return chosen.map((word) => word[0].toUpperCase()).join("");
}

const byCategory: Record<ServiceCategory, string> = {
  barberia: images.corte,
  color: gallery.color,
  combos: images.corteBarba,
  depilacion: images.towels,
  ninos: images.corte,
  maquillaje: images.cejas,
  mujer: gallery.color,
  pestanas: images.cejas,
  spa: images.towels,
  tratamientos: gallery.color,
  unas: images.manicure,
  otros: images.towels,
};

/** Prefer name-specific photos; otherwise a coherent category photo. Always returns an image. */
export function resolveServiceImage(service: Pick<Service, "name" | "category" | "image">): string {
  const label = normalize(service.name);

  if (label === "corte y barba" || label === "corte, barba y cejas") return images.corteBarba;
  if (label === "corte" || label === "corte y cejas" || label.includes("corte caballero") || label.includes("corte nino") || label.includes("corte nina")) {
    return images.corte;
  }
  if (label === "barba" || label === "barba con marcacion" || label === "barba y cejas" || label.startsWith("barba ")) {
    return images.barba;
  }
  if (label.includes("ceja")) return images.cejas;
  if (label.startsWith("pedicure") || label.includes("spa pies") || label.includes("pies")) return images.pedicure;
  if (label.startsWith("manicure") || label.startsWith("unas ") || label.startsWith("decoracion unas") || label.startsWith("recubrimiento") || label === "cambio de esmalte") {
    return images.manicure;
  }
  if (label.includes("color") || label.includes("tinte") || label.includes("mecha") || label.includes("balayage") || label.includes("keratina") || label.includes("alisado") || label.includes("hidratacion") || label.includes("brushing") || label.includes("peinado")) {
    return gallery.color;
  }
  if (label.includes("shampoo") || label.includes("spa") || label.includes("masaje") || label.includes("facial") || label.includes("depilacion")) {
    return images.towels;
  }
  if (label.includes("pestana") || label.includes("maquillaje") || label.includes("cejas")) {
    return images.cejas;
  }

  if (service.image) return service.image;
  return byCategory[service.category] ?? images.towels;
}

/** @deprecated Prefer resolveServiceImage — kept for any legacy imports. */
export function clearServiceImage(name: string) {
  return resolveServiceImage({ name, category: "otros" });
}
