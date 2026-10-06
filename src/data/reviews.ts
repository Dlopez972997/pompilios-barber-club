import { images } from "../assets/images";
import type { Review } from "./types";

export const reviews: Review[] = [
  {
    id: "carlos-mendez",
    name: "Carlos Méndez",
    rating: 5,
    text: "Excelente servicio, ambiente muy agradable y un corte impecable. Siempre es mi primera opción.",
    image: images.carlos,
  },
  {
    id: "javier-rojas",
    name: "Javier Rojas",
    rating: 5,
    text: "La atención, el detalle y la calidad son de otro nivel. Se nota la experiencia. Totalmente recomendado.",
    image: images.javier,
  },
];
