import cut from "../assets/gallery/reel-daxh.jpg";
import color from "../assets/gallery/reel-dy-c.jpg";
import process from "../assets/gallery/reel-dvrk.jpg";
import fade from "../assets/gallery/reel-dspm.jpg";
import shave from "../assets/gallery/reel-dnro.jpg";
import highlights from "../assets/gallery/reel-dbpn.jpg";
import look from "../assets/gallery/reel-c_gs.jpg";
import beard from "../assets/gallery/photo-c1vj.jpg";

export const instagramUrl = "https://www.instagram.com/pompiliosbarberclub/";

export type GalleryItem = {
  id: string;
  kind: "reel" | "photo";
  image: string;
  href: string;
  alt: string;
};

export const gallery: GalleryItem[] = [
  {
    id: "DaxhYITRAim",
    kind: "reel",
    image: cut,
    href: "https://www.instagram.com/pompiliosbarberclub/reel/DaxhYITRAim/",
    alt: "Reel de Pompilio's Barber Club, 14 de julio de 2026",
  },
  {
    id: "DY-cvGNNx1z",
    kind: "reel",
    image: color,
    href: "https://www.instagram.com/pompiliosbarberclub/reel/DY-cvGNNx1z/",
    alt: "Reel de Pompilio's Barber Club, 30 de mayo de 2026",
  },
  {
    id: "DVRkeEnEZgp",
    kind: "reel",
    image: process,
    href: "https://www.instagram.com/pompiliosbarberclub/reel/DVRkeEnEZgp/",
    alt: "Reel de Pompilio's Barber Club, 27 de febrero de 2026",
  },
  {
    id: "DSpm8j0ETqD",
    kind: "reel",
    image: fade,
    href: "https://www.instagram.com/pompiliosbarberclub/reel/DSpm8j0ETqD/",
    alt: "Reel de Pompilio's Barber Club, 24 de diciembre de 2025",
  },
  {
    id: "DNROE37RgM-",
    kind: "reel",
    image: shave,
    href: "https://www.instagram.com/pompiliosbarberclub/reel/DNROE37RgM-/",
    alt: "Reel de Pompilio's Barber Club, 12 de agosto de 2025",
  },
  {
    id: "DBPnDlGR5N4",
    kind: "reel",
    image: highlights,
    href: "https://www.instagram.com/pompiliosbarberclub/reel/DBPnDlGR5N4/",
    alt: "Reel de Pompilio's Barber Club, 17 de octubre de 2024",
  },
  {
    id: "C_GSn0gRUxh",
    kind: "reel",
    image: look,
    href: "https://www.instagram.com/pompiliosbarberclub/reel/C_GSn0gRUxh/",
    alt: "Reel de Pompilio's Barber Club, 25 de agosto de 2024",
  },
  {
    id: "C1Vjx0_rPgI",
    kind: "photo",
    image: beard,
    href: "https://www.instagram.com/pompiliosbarberclub/p/C1Vjx0_rPgI/",
    alt: "Publicación de Pompilio's Barber Club, 26 de diciembre de 2023",
  },
];
