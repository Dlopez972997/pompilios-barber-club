export type ServiceCategory = "corte" | "barba" | "unas";

export type Service = {
  id: string;
  name: string;
  description: string;
  durationLabel: string;
  durationMin: number;
  durationMax: number;
  price: number;
  categories: ServiceCategory[];
  image: string;
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
