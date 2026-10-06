import type { Service, TeamMember } from "../../data/types";
import { branch } from "../../data/site";
import { formatLongDate, formatPrice } from "../../utils/dates";
import { Button } from "../Button/Button";
import { IconCalendar, IconClock, IconLock, IconPin } from "../Icons";

type Props = {
  service: Service | null;
  professional: TeamMember | null;
  date: Date | null;
  time: string | null;
  onConfirm: () => void;
};

export function BookingSummary({ service, professional, date, time, onConfirm }: Props) {
  const ready = Boolean(service && professional && date && time);

  return (
    <aside className="summary" aria-label="Resumen de tu cita">
      <h2>Resumen de tu cita</h2>
      <ul>
        <li>
          <img src={service?.image} alt="" />
          <div>
            <span>Servicio</span>
            <strong>{service?.name ?? "Por elegir"}</strong>
          </div>
          <b>{service ? formatPrice(service.price) : ""}</b>
        </li>
        <li>
          {professional ? <img src={professional.image} alt="" /> : <span className="summary-placeholder" />}
          <div>
            <span>Profesional</span>
            <strong>{professional?.name ?? "Por elegir"}</strong>
            {professional ? <small>{professional.bookingLabel}</small> : null}
          </div>
        </li>
        <li>
          <span className="summary-icon">
            <IconCalendar />
          </span>
          <div>
            <span>Fecha</span>
            <strong>{date ? formatLongDate(date) : "Por elegir"}</strong>
          </div>
        </li>
        <li>
          <span className="summary-icon">
            <IconClock />
          </span>
          <div>
            <span>Hora</span>
            <strong>{time ?? "Por elegir"}</strong>
          </div>
        </li>
        <li>
          <span className="summary-icon">
            <IconPin />
          </span>
          <div>
            <span>Sucursal</span>
            <strong>{branch.address}</strong>
            <small>
              {branch.days} {branch.hours}
            </small>
          </div>
        </li>
      </ul>
      <div className="summary-total">
        <span>Total</span>
        <strong>{service ? formatPrice(service.price) : "$0"}</strong>
      </div>
      <Button full arrow disabled={!ready} onClick={onConfirm}>
        Confirmar reserva
      </Button>
      <p className="summary-note">
        <IconLock size={14} />
        Tu información está protegida y es 100% segura.
      </p>
    </aside>
  );
}
