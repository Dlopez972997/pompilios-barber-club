import { images } from "../assets/images";
import type { TeamMember } from "./types";

export const team: TeamMember[] = [
  {
    id: "andres-rojas",
    name: "Andrés Rojas",
    firstName: "Andrés",
    role: "Barbero principal",
    bookingLabel: "Barbero principal",
    rating: 4.9,
    reviews: 128,
    specialties: ["Corte de cabello", "Barba", "Estilo clásico"],
    bio: "Especialista en cortes modernos y barbería clásica. Andrés se destaca por su precisión, estilo y la atención personalizada que brinda a cada cliente.",
    group: "barberos",
    image: images.andres,
    featured: true,
  },
  {
    id: "mateo-vargas",
    name: "Mateo Vargas",
    firstName: "Mateo",
    role: "Barbero",
    bookingLabel: "Especialista en barba",
    rating: 4.9,
    reviews: 96,
    specialties: ["Barba", "Corte de cabello", "Perfilado"],
    bio: "Barbero con enfoque en perfilado de barba y cortes que respetan la forma del rostro. Su trabajo se distingue por la limpieza del acabado.",
    group: "barberos",
    image: images.mateo,
  },
  {
    id: "sebastian-leon",
    name: "Sebastián León",
    firstName: "Sebastián",
    role: "Especialista en barba",
    bookingLabel: "Corte clásico y moderno",
    rating: 4.9,
    reviews: 112,
    specialties: ["Barba", "Estilo clásico", "Afeitado"],
    bio: "Especialista en barba clásica y moderna. Cuida la línea, la textura y el detalle para un resultado preciso.",
    group: "barba",
    image: images.sebastian,
  },
  {
    id: "daniel-cruz",
    name: "Daniel Cruz",
    firstName: "Daniel",
    role: "Barbero",
    bookingLabel: "Barbero",
    rating: 4.7,
    reviews: 84,
    specialties: ["Corte de cabello", "Fade", "Estilo moderno"],
    bio: "Cortes contemporáneos con técnica limpia y una atención cercana en cada visita.",
    group: "barberos",
    image: images.daniel,
  },
  {
    id: "valentina-torres",
    name: "Valentina Torres",
    firstName: "Valentina",
    role: "Manicurista",
    bookingLabel: "Manicurista",
    rating: 4.8,
    reviews: 73,
    specialties: ["Manicure", "Pedicure", "Cuidado de manos"],
    bio: "Manicurista enfocada en el cuidado, la higiene y un acabado impecable.",
    group: "manicuristas",
    image: images.valentina,
  },
  {
    id: "ricardo-mendez",
    name: "Ricardo Méndez",
    firstName: "Ricardo",
    role: "Especialista en barba",
    bookingLabel: "Especialista en barba",
    rating: 4.8,
    reviews: 91,
    specialties: ["Barba", "Cejas", "Perfilado"],
    bio: "Especialista en barba y perfilado. Busca un resultado natural, definido y cómodo.",
    group: "barba",
    image: images.ricardo,
  },
];

export const featuredMember = team.find((member) => member.featured) ?? team[0];

export function getMember(id: string | null) {
  if (!id) return undefined;
  return team.find((member) => member.id === id);
}
