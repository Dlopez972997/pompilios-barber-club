import type { Service } from "../../data/types";
import { formatPrice } from "../../utils/dates";
import { Button } from "../Button/Button";
import { IconClock } from "../Icons";

type Props = {
  service: Service;
};

export function ServiceCard({ service }: Props) {
  return (
    <article className="service-card">
      <div className="service-media">
        <img src={service.image} alt={service.name} />
      </div>
      <div className="service-body">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-meta">
          <span>
            <IconClock size={16} />
            {service.durationLabel}
          </span>
          <strong>{formatPrice(service.price)}</strong>
        </div>
        <Button variant="outline" full arrow to={`/reservas?service=${service.id}`}>
          Reservar cita
        </Button>
      </div>
    </article>
  );
}
