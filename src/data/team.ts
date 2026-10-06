import { images } from "../assets/images";
import type { TeamMember } from "./types";

export const team: TeamMember[] = [
  {
    id: "fernando-lugo",
    name: "Fernando Lugo",
    firstName: "Fernando",
    role: "Barbero principal",
    bookingLabel: "Barbero profesional",
    rating: 4.9,
    specialties: ["Corte", "Barba"],
    bio: "Barbero profesional de Pompilio's Barber Club.",
    group: "barberos",
    image: images.andres,
    featured: true,
  },
  {
    id: "nicolas-zamudio",
    name: "Nicolas Zamudio",
    firstName: "Nicolas",
    role: "Barbero",
    bookingLabel: "Barbero",
    rating: 5,
    specialties: ["Corte", "Barba"],
    bio: "Barbero del equipo de Pompilio's Barber Club.",
    group: "barberos",
    image: images.mateo,
  },
  {
    id: "leonel-gonzalez",
    name: "Leonel Gonzalez",
    firstName: "Leonel",
    role: "Barbero",
    bookingLabel: "Barbero",
    rating: 4.7,
    specialties: ["Corte", "Barba"],
    bio: "Barbero del equipo de Pompilio's Barber Club.",
    group: "barberos",
    image: images.daniel,
  },
  {
    id: "rodolfo-campos",
    name: "Rodolfo Campos",
    firstName: "Rodolfo",
    role: "Barbero",
    bookingLabel: "Barbero",
    rating: 4.9,
    specialties: ["Corte", "Barba"],
    bio: "Barbero del equipo de Pompilio's Barber Club.",
    group: "barberos",
    image: images.sebastian,
  },
  {
    id: "gabriel-lugo",
    name: "Gabriel Lugo",
    firstName: "Gabriel",
    role: "Barbero",
    bookingLabel: "Barbero profesional",
    rating: 4.9,
    specialties: ["Corte", "Barba"],
    bio: "Barbero profesional de Pompilio's Barber Club.",
    group: "barberos",
    image: images.ricardo,
  },
  {
    id: "karen",
    name: "Karen",
    firstName: "Karen",
    role: "Manicurista",
    bookingLabel: "Manicurista",
    rating: 5,
    specialties: ["Manicure", "Pedicure"],
    bio: "Manicurista del equipo de Pompilio's Barber Club.",
    group: "manicuristas",
    image: images.valentina,
  },
];

export const featuredMember = team.find((member) => member.featured) ?? team[0];

export function getMember(id: string | null) {
  if (!id) return undefined;
  return team.find((member) => member.id === id);
}
