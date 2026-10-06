import { images } from "../assets/images";

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

export function clearServiceImage(name: string) {
  const label = normalize(name);
  if (label === "corte y barba" || label === "corte, barba y cejas") return images.corteBarba;
  if (label === "corte" || label === "corte y cejas") return images.corte;
  if (label === "barba" || label === "barba con marcacion" || label === "barba y cejas") return images.barba;
  if (label.startsWith("pedicure")) return images.pedicure;
  if (label.startsWith("manicure") && !label.includes("pedicure")) return images.manicure;
  if (
    label.startsWith("unas ") ||
    label.startsWith("decoracion unas") ||
    label.startsWith("recubrimiento") ||
    label === "cambio de esmalte"
  ) {
    return images.manicure;
  }
  return undefined;
}
