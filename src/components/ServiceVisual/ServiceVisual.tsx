import { serviceInitials } from "../../data/serviceImage";

type Props = {
  name: string;
  image?: string;
  alt?: string;
};

export function ServiceVisual({ name, image, alt = "" }: Props) {
  if (image) return <img src={image} alt={alt} />;
  return (
    <span className="service-mark" aria-hidden="true">
      {serviceInitials(name)}
    </span>
  );
}
