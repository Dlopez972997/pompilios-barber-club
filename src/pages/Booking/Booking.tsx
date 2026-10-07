import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { images } from "../../assets/images";
import { services, getService, serviceCategories } from "../../data/services";
import { branch } from "../../data/site";
import { getMember, primaryProfessionals, team } from "../../data/team";
import type { Service, TeamMember } from "../../data/types";
import { BookingStepper, type StepState } from "../../components/BookingStepper/BookingStepper";
import { BookingSummary } from "../../components/BookingSummary/BookingSummary";
import { Button } from "../../components/Button/Button";
import { Calendar } from "../../components/Calendar/Calendar";
import { IconCheck, IconClock, IconDiamond, IconSwap } from "../../components/Icons";
import { Modal } from "../../components/Modal/Modal";
import { PageHero } from "../../components/PageHero/PageHero";
import { Rating } from "../../components/Rating/Rating";
import { ServiceVisual } from "../../components/ServiceVisual/ServiceVisual";
import { TimeSlots } from "../../components/TimeSlots/TimeSlots";
import { defaultBookingDate, formatLongDate, formatPrice, parseSlot, toIcsStamp } from "../../utils/dates";

const primaryPros = primaryProfessionals;

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function unavailableSlots(date: Date | null) {
  if (!date) return [];
  const day = date.getDate();
  if (day % 2 === 0) return ["11:30 a.m.", "4:30 p.m."];
  return ["10:30 a.m.", "3:00 p.m."];
}

export function BookingPage() {
  const [params] = useSearchParams();
  const serviceParam = params.get("service");
  const professionalParam = params.get("professional");
  const hasQuery = Boolean(serviceParam || professionalParam);
  const initialDate = useMemo(() => defaultBookingDate(), []);

  const [service, setService] = useState<Service>(getService(serviceParam) ?? getService("corte-y-barba") ?? services[0]);
  const [professional, setProfessional] = useState<TeamMember | null>(
    getMember(professionalParam) ?? (hasQuery ? null : (team[0] ?? null)),
  );
  const [month, setMonth] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [date, setDate] = useState<Date | null>(hasQuery ? null : initialDate);
  const [time, setTime] = useState<string | null>(hasQuery ? null : "1:00 p.m.");
  const [showAll, setShowAll] = useState(() => Boolean(professionalParam && !primaryPros.includes(professionalParam)));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [pickerCategory, setPickerCategory] = useState<"all" | Service["category"]>("all");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    document.title = "Reservas | Pompilio's Hair Atelier";
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".page-booking .reveal"));
    if (reduce) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    nodes.forEach((node) => {
      if (!node.classList.contains("is-in")) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [showAll]);

  useEffect(() => {
    const nextService = getService(serviceParam);
    const nextProfessional = getMember(professionalParam);
    if (nextService) setService(nextService);
    if (nextProfessional) {
      setProfessional(nextProfessional);
      if (!primaryPros.includes(nextProfessional.id)) setShowAll(true);
    }
  }, [serviceParam, professionalParam]);

  const disabledSlots = unavailableSlots(date);
  const visiblePros = showAll ? team : team.filter((member) => primaryPros.includes(member.id));
  const pickerServices = useMemo(() => {
    const q = normalize(pickerQuery.trim());
    return services.filter((item) => {
      if (pickerCategory !== "all" && item.category !== pickerCategory) return false;
      if (q && !normalize(`${item.name} ${item.description}`).includes(q)) return false;
      return true;
    });
  }, [pickerQuery, pickerCategory]);
  const ready = Boolean(service && professional && date && time && !disabledSlots.includes(time ?? ""));

  const states: StepState[] = [
    "complete",
    professional ? "complete" : "current",
    !professional ? "pending" : date && time ? "complete" : "current",
    !ready ? "pending" : confirmed ? "complete" : "current",
  ];

  function selectDate(next: Date) {
    setDate(next);
    const blocked = unavailableSlots(next);
    if (time && blocked.includes(time)) setTime(null);
    setConfirmed(false);
  }

  function downloadCalendar() {
    if (!service || !professional || !date || !time) return;
    const start = parseSlot(time, date);
    const end = new Date(start.getTime() + service.durationMax * 60000);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Pompilios Hair Atelier//ES",
      "BEGIN:VEVENT",
      `DTSTART:${toIcsStamp(start)}`,
      `DTEND:${toIcsStamp(end)}`,
      `SUMMARY:Cita en Pompilio's - ${service.name}`,
      `LOCATION:${branch.street}, ${branch.city}, ${branch.country}`,
      `DESCRIPTION:Profesional: ${professional.name}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const file = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cita-pompilios.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page page-booking">
      <div className="booking-hero">
        <PageHero
          crumbs={[
            { label: "Inicio", to: "/" },
            { label: "Reservas" },
          ]}
          title="Reserva tu cita."
          text="Agenda tu servicio en pocos pasos y vive la experiencia Pompilio's con la misma calidad y detalle."
          image={images.corteBarba}
          imageAlt="Barbero realizando un corte y barba en Pompilio's"
          variant="banner"
        />
        <div className="container">
          <BookingStepper states={states} />
        </div>
      </div>

      <section className="section booking-section">
        <div className="container">
          <div className="booking-layout">
            <article className="panel service-panel reveal">
              <h2>Servicio seleccionado</h2>
              <ServiceVisual name={service.name} image={service.image} alt={service.name} />
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-meta">
                <span>
                  <IconClock size={15} />
                  {service.durationLabel}
                </span>
                <strong>{formatPrice(service.price)}</strong>
              </div>
              <Button variant="outline" full onClick={() => setPickerOpen(true)}>
                <IconSwap />
                Cambiar servicio
              </Button>
            </article>

            <div className="booking-main">
              <article className="panel">
                <div className="panel-head">
                  <h2>Selecciona tu profesional</h2>
                  <button type="button" className="text-btn" onClick={() => setShowAll((value) => !value)}>
                    {showAll ? "Ver menos" : "Ver todo el equipo"}
                  </button>
                </div>
                <div className="pro-grid">
                  {visiblePros.map((member, index) => {
                    const selected = professional?.id === member.id;
                    return (
                      <button
                        key={member.id}
                        type="button"
                        className={`pro-card reveal${selected ? " is-selected" : ""}`}
                        style={{ animationDelay: `${index * 70}ms` }}
                        aria-pressed={selected}
                        onClick={() => {
                          setProfessional(member);
                          setConfirmed(false);
                        }}
                      >
                        <span className="pro-photo">
                          <img src={member.image} alt="" />
                          {selected ? (
                            <span className="pro-check">
                              <IconCheck size={14} />
                            </span>
                          ) : null}
                        </span>
                        <strong>{member.name}</strong>
                        <Rating value={member.rating} count={member.reviews} />
                        <small>{member.bookingLabel}</small>
                      </button>
                    );
                  })}
                </div>
              </article>

              <article className="panel reveal" style={{ animationDelay: "80ms" }}>
                <h2>Elige fecha y hora</h2>
                <div className="datetime">
                  <Calendar month={month} selected={date} onMonth={setMonth} onSelect={selectDate} />
                  <TimeSlots
                    selected={time}
                    disabledSlots={disabledSlots}
                    onSelect={(slot) => {
                      setTime(slot);
                      setConfirmed(false);
                    }}
                  />
                </div>
              </article>
            </div>

            <BookingSummary
              className="reveal"
              service={service}
              professional={professional}
              date={date}
              time={time}
              onConfirm={() => setConfirmed(true)}
            />
          </div>
        </div>
      </section>

      <section className="services-perks" aria-label="Beneficios">
        <ul className="container services-perks-row">
          <li>
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                d="M8 4.5 5 8l3 2 2-2 6 6 2-2-6-6 2-2-3.5-3.5L8 4.5Zm8 8-6 6 1.5 1.5 6-6L16 12.5Z"
              />
            </svg>
            <div>
              <strong>Técnica profesional</strong>
              <span>Resultados con criterio.</span>
            </div>
          </li>
          <li>
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                d="M6 11V7.5A2.5 2.5 0 0 1 8.5 5h7A2.5 2.5 0 0 1 18 7.5V11M4 11h16v3.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V11Zm3 6.5V20m10-2.5V20"
              />
            </svg>
            <div>
              <strong>Ambiente de primera</strong>
              <span>Un espacio pensado para ti.</span>
            </div>
          </li>
          <li>
            <IconDiamond size={28} />
            <div>
              <strong>Cuidado en cada detalle</strong>
              <span>Más que un servicio, una experiencia.</span>
            </div>
          </li>
        </ul>
      </section>

      <Modal open={pickerOpen} title="Elige un servicio" onClose={() => setPickerOpen(false)} wide>
        <div className="picker-tools">
          <label className="search">
            <span className="sr-only">Buscar servicio</span>
            <input
              type="search"
              value={pickerQuery}
              placeholder="Buscar servicio..."
              onChange={(event) => setPickerQuery(event.target.value)}
            />
          </label>
          <div className="pills" role="tablist" aria-label="Categorías de servicios">
            <button
              type="button"
              className={`pill${pickerCategory === "all" ? " is-active" : ""}`}
              aria-selected={pickerCategory === "all"}
              onClick={() => setPickerCategory("all")}
            >
              Todos
            </button>
            {serviceCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`pill${pickerCategory === item.id ? " is-active" : ""}`}
                aria-selected={pickerCategory === item.id}
                onClick={() => setPickerCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="picker-grid">
          {pickerServices.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`picker-card${item.id === service.id ? " is-selected" : ""}`}
              onClick={() => {
                setService(item);
                setConfirmed(false);
                setPickerOpen(false);
              }}
            >
              <ServiceVisual name={item.name} image={item.image} />
              <span>
                <strong>{item.name}</strong>
                <small>
                  {item.durationLabel ? `${item.durationLabel} · ` : ""}
                  {item.priceFrom ? `${item.priceLabel} ` : ""}
                  {formatPrice(item.price)}
                </small>
              </span>
            </button>
          ))}
        </div>
        {pickerServices.length === 0 ? <p className="empty">No hay servicios con esa búsqueda.</p> : null}
      </Modal>

      <Modal open={confirmed && ready} title="Tu cita ha sido reservada" onClose={() => setConfirmed(false)}>
        {service && professional && date && time ? (
          <div className="confirm">
            <span className="confirm-badge">
              <IconCheck size={22} />
            </span>
            <p>Te esperamos en Pompilio's Hair Atelier. Guarda estos datos de tu cita.</p>
            <ul>
              <li>
                <span>Servicio</span>
                <strong>{service.name}</strong>
              </li>
              <li>
                <span>Profesional</span>
                <strong>{professional.name}</strong>
              </li>
              <li>
                <span>Fecha</span>
                <strong>{formatLongDate(date)}</strong>
              </li>
              <li>
                <span>Hora</span>
                <strong>{time}</strong>
              </li>
              <li>
                <span>Ubicación</span>
                <strong>
                  {branch.street}
                  <br />
                  {branch.city}
                </strong>
              </li>
            </ul>
            <div className="confirm-actions">
              <Button to="/">Volver al inicio</Button>
              <Button variant="outline" onClick={downloadCalendar}>
                Agregar al calendario
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
