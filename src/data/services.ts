import { images } from "../assets/images";
import type { Service } from "./types";

export const services: Service[] = [
  {
    id: "corte-cabello",
    name: "Corte de cabello",
    description:
      "Un corte con estilo, precisión y el acabado que mejor se adapta a ti.",
    durationLabel: "30 - 40 min",
    durationMin: 30,
    durationMax: 40,
    price: 150,
    categories: ["corte"],
    image: images.corte,
    featured: true,
  },
  {
    id: "corte-barba",
    name: "Corte y barba",
    description:
      "El equilibrio perfecto entre un gran corte y una barba impecable.",
    durationLabel: "45 - 60 min",
    durationMin: 45,
    durationMax: 60,
    price: 220,
    categories: ["corte", "barba"],
    image: images.corteBarba,
    featured: true,
  },
  {
    id: "barba",
    name: "Barba",
    description:
      "Dale forma, estilo y carácter a tu barba con un acabado profesional.",
    durationLabel: "20 - 30 min",
    durationMin: 20,
    durationMax: 30,
    price: 120,
    categories: ["barba"],
    image: images.barba,
    featured: true,
  },
  {
    id: "manicure-tradicional",
    name: "Manicure tradicional",
    description: "Cuidado y limpieza para unas manos siempre impecables.",
    durationLabel: "30 - 40 min",
    durationMin: 30,
    durationMax: 40,
    price: 120,
    categories: ["unas"],
    image: images.manicure,
  },
  {
    id: "cejas-cuchilla",
    name: "Cejas con cuchilla",
    description: "Dale forma a tu mirada con un acabado limpio y preciso.",
    durationLabel: "15 - 20 min",
    durationMin: 15,
    durationMax: 20,
    price: 100,
    categories: ["barba"],
    image: images.cejas,
  },
  {
    id: "pedicure-hombre",
    name: "Pedicure hombre",
    description: "Higiene, cuidado y frescura para tu día a día.",
    durationLabel: "40 - 50 min",
    durationMin: 40,
    durationMax: 50,
    price: 150,
    categories: ["unas"],
    image: images.pedicure,
  },
];

export const featuredServices = services.filter((service) => service.featured);

export function getService(id: string | null) {
  if (!id) return undefined;
  return services.find((service) => service.id === id);
}
