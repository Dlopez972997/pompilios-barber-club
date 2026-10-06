export type ServiceCategory =
  | "barberia"
  | "color"
  | "combos"
  | "depilacion"
  | "ninos"
  | "maquillaje"
  | "mujer"
  | "pestanas"
  | "spa"
  | "tratamientos"
  | "unas"
  | "otros";

export type Service = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ServiceCategory;
  durationLabel: string;
  durationMin: number;
  durationMax: number;
  price: number;
  priceFrom?: boolean;
  priceLabel?: string;
  image?: string;
  popular?: boolean;
  featured?: boolean;
};

export type TeamGroup = "barberos" | "manicuristas" | "integrales";

export type TeamMember = {
  id: string;
  name: string;
  firstName: string;
  role: string;
  bookingLabel: string;
  rating?: number;
  reviews?: number;
  specialties?: string[];
  bio?: string;
  group: TeamGroup;
  image: string;
  featured?: boolean;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  image: string;
};
