import edixson from "../assets/team/edixson.webp";
import fernando from "../assets/team/fernando-lugo.webp";
import gabriel from "../assets/team/gabriel-lugo.webp";
import jenny from "../assets/team/jenny-moreno.webp";
import joselin from "../assets/team/joselin-mendoza.webp";
import karen from "../assets/team/karen.webp";
import katherine from "../assets/team/katherine-soto.webp";
import leonel from "../assets/team/leonel-gonzalez.webp";
import nicolas from "../assets/team/nicolas-zamudio.webp";
import orangel from "../assets/team/orangel-gonzalez.webp";
import rodolfo from "../assets/team/rodolfo-campos.webp";
import type { TeamMember } from "./types";

export const team: TeamMember[] = [
  {
    id: "nicolas-zamudio",
    name: "Nicolas Zamudio",
    firstName: "Nicolas",
    role: "Barbero",
    bookingLabel: "Barbero",
    rating: 5,
    group: "barberos",
    image: nicolas,
    featured: true,
  },
  {
    id: "karen",
    name: "Karen",
    firstName: "Karen",
    role: "Manicurista",
    bookingLabel: "Manicurista",
    rating: 5,
    group: "manicuristas",
    image: karen,
  },
  {
    id: "rodolfo-campos",
    name: "Rodolfo Campos",
    firstName: "Rodolfo",
    role: "Barbero Profesional",
    bookingLabel: "Barbero Profesional",
    rating: 4.95,
    group: "barberos",
    image: rodolfo,
  },
  {
    id: "fernando-lugo",
    name: "Fernando Lugo",
    firstName: "Fernando",
    role: "Barbero Profesional",
    bookingLabel: "Barbero Profesional",
    rating: 4.88,
    group: "barberos",
    image: fernando,
  },
  {
    id: "gabriel-lugo",
    name: "Gabriel Lugo",
    firstName: "Gabriel",
    role: "Barbero Profesional",
    bookingLabel: "Barbero Profesional",
    rating: 5,
    group: "barberos",
    image: gabriel,
  },
  {
    id: "edixson",
    name: "Edixson",
    firstName: "Edixson",
    role: "Barbero",
    bookingLabel: "Barbero",
    rating: 5,
    group: "barberos",
    image: edixson,
  },
  {
    id: "jenny-moreno",
    name: "Jenny Moreno",
    firstName: "Jenny",
    role: "Estilista integral",
    bookingLabel: "Estilista integral",
    rating: 5,
    group: "integrales",
    image: jenny,
  },
  {
    id: "leonel-gonzalez",
    name: "Leonel Gonzalez",
    firstName: "Leonel",
    role: "Barbero Profesional",
    bookingLabel: "Barbero Profesional",
    rating: 4.7,
    group: "barberos",
    image: leonel,
  },
  {
    id: "orangel-gonzalez",
    name: "Orangel Gonzalez",
    firstName: "Orangel",
    role: "Barbero Profesional",
    bookingLabel: "Barbero Profesional",
    rating: 5,
    group: "barberos",
    image: orangel,
  },
  {
    id: "joselin-mendoza",
    name: "Joselin Mendoza",
    firstName: "Joselin",
    role: "Estilista Integral",
    bookingLabel: "Estilista Integral",
    rating: 5,
    group: "integrales",
    image: joselin,
  },
  {
    id: "katherine-soto",
    name: "Katherine Soto",
    firstName: "Katherine",
    role: "Manicurista",
    bookingLabel: "Manicurista",
    rating: 5,
    group: "manicuristas",
    image: katherine,
  },
];

export const featuredMember = team.find((member) => member.featured) ?? team[0];

export const primaryProfessionals = team.slice(0, 3).map((member) => member.id);

export function getMember(id: string | null) {
  if (!id) return undefined;
  return team.find((member) => member.id === id);
}
