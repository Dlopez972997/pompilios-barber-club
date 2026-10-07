import type { Service } from "../../data/types";
import { formatPrice } from "../../utils/dates";
import { Button } from "../Button/Button";
import { IconClock } from "../Icons";
import { ServiceVisual } from "../ServiceVisual/ServiceVisual";

type Props = {
  service: Service;
};

export function ServiceCard({ service }: Props) {
  return (
    <article id={`service-${service.slug}`} className="service-card">
      <div className="service-media">
        <ServiceVisual name={service.name} image={service.image} imagePosition={service.imagePosition} category={service.category} alt={service.name} />
      </div>
      <div className="service-body">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-meta">
          {service.durationLabel ? (
            <span>
              <IconClock size={16} />
              {service.durationLabel}
            </span>
          ) : (
            <span />
          )}
          <strong>
            {service.priceFrom ? <small>{service.priceLabel}</small> : null}
            {formatPrice(service.price)}
          </strong>
        </div>
        <Button variant="outline" full arrow to={`/reservas?service=${service.id}`}>
          Reservar cita
        </Button>
      </div>
    </article>
  );
}
