import { images } from "../assets/images";
import type { Service } from "./types";

export const services: Service[] = [
  {
    id: "corte-cabello",
    name: "Corte de cabello",
    description:
      "Un corte con estilo, precisión y el acabado que mejor se adapta a ti.",
    durationLabel: "30 min",
    durationMin: 30,
    durationMax: 30,
    price: 45000,
    categories: ["corte"],
    image: images.corte,
    featured: true,
  },
  {
    id: "corte-barba",
    name: "Corte y barba",
    description:
      "El equilibrio perfecto entre un gran corte y una barba impecable.",
    durationLabel: "50 min",
    durationMin: 50,
    durationMax: 50,
    price: 65000,
    categories: ["corte", "barba"],
    image: images.corteBarba,
    featured: true,
  },
  {
    id: "barba",
    name: "Barba",
    description:
      "Dale forma, estilo y carácter a tu barba con un acabado profesional.",
    durationLabel: "20 min",
    durationMin: 20,
    durationMax: 20,
    price: 38000,
    categories: ["barba"],
    image: images.barba,
    featured: true,
  },
  {
    id: "manicure-tradicional",
    name: "Manicure tradicional",
    description: "Cuidado y limpieza para unas manos siempre impecables.",
    durationLabel: "40 min",
    durationMin: 40,
    durationMax: 40,
    price: 35000,
    categories: ["unas"],
    image: images.manicure,
  },
  {
    id: "cepillado",
    name: "Cepillado",
    description: "Peinado y acabado para dejar el corte con forma y brillo.",
    durationLabel: "45 min",
    durationMin: 45,
    durationMax: 45,
    price: 45000,
    categories: ["corte"],
    image: images.corte,
  },
  {
    id: "manicure-pedicure",
    name: "Manicure y pedicure hombre",
    description: "Cuidado completo de manos y pies, con higiene y un acabado prolijo.",
    durationLabel: "1 h 20 min",
    durationMin: 80,
    durationMax: 80,
    price: 80000,
    categories: ["unas"],
    image: images.pedicure,
  },
];

export const featuredServices = services.filter((service) => service.featured);

export function getService(id: string | null) {
  if (!id) return undefined;
  return services.find((service) => service.id === id);
}
