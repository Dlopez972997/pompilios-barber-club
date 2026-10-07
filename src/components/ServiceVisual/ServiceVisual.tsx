import type { ServiceCategory } from "../../data/types";
import { serviceInitials } from "../../data/serviceImage";

type Props = {
  name: string;
  image?: string;
  imagePosition?: string;
  category?: ServiceCategory;
  alt?: string;
};

const categoryDetails: Record<ServiceCategory, { icon: string; label: string }> = {
  barberia: { icon: "✂", label: "Barbería" },
  color: { icon: "◉", label: "Color" },
  combos: { icon: "✂", label: "Servicio combinado" },
  depilacion: { icon: "⌁", label: "Depilación" },
  ninos: { icon: "✦", label: "Los chiquitos" },
  maquillaje: { icon: "✧", label: "Maquillaje" },
  mujer: { icon: "◇", label: "Peluquería" },
  pestanas: { icon: "◉", label: "Pestañas" },
  spa: { icon: "≈", label: "Spa" },
  tratamientos: { icon: "✧", label: "Tratamiento" },
  unas: { icon: "◇", label: "Cuidado de uñas" },
  otros: { icon: "✦", label: "Pompilio’s" },
};

export function ServiceVisual({ name, image, imagePosition, category, alt = "" }: Props) {
  if (image) {
    return <img src={image} alt={alt} style={{ objectPosition: imagePosition || "center" }} loading="lazy" />;
  }
  const detail = categoryDetails[category || "otros"];
  return (
    <div className="service-placeholder" role="img" aria-label={name}>
      <span className="service-placeholder-icon" aria-hidden="true">{detail.icon}</span>
      <span className="service-placeholder-category">{detail.label}</span>
      <strong>{name}</strong>
      <span className="service-placeholder-initials" aria-hidden="true">{serviceInitials(name)}</span>
    </div>
  );
}
