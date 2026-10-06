import { images } from "../assets/images";
import type { Review } from "./types";

export const reviews: Review[] = [
  {
    id: "carlos-charria",
    name: "Carlos Charria",
    rating: 5,
    text: "Servicio muy bueno y profesional.",
    image: images.carlos,
  },
  {
    id: "andres-david-castillo",
    name: "Andrés David Castillo",
    rating: 5,
    text: "Todo.",
    image: images.javier,
  },
];
