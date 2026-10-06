import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { images } from "../../assets/images";
import { services, getService } from "../../data/services";
import { branch } from "../../data/site";
import { getMember, team } from "../../data/team";
import type { Service, TeamMember } from "../../data/types";
import { BookingStepper, type StepState } from "../../components/BookingStepper/BookingStepper";
import { BookingSummary } from "../../components/BookingSummary/BookingSummary";
import { Button } from "../../components/Button/Button";
import { Calendar } from "../../components/Calendar/Calendar";
import { IconBolt, IconCheck, IconClock, IconPin, IconShield, IconSwap } from "../../components/Icons";
import { Modal } from "../../components/Modal/Modal";
import { PageHero } from "../../components/PageHero/PageHero";
import { Rating } from "../../components/Rating/Rating";
import { TimeSlots } from "../../components/TimeSlots/TimeSlots";
import { defaultBookingDate, formatLongDate, formatPrice, parseSlot, toIcsStamp } from "../../utils/dates";

const primaryPros = ["fernando-lugo", "nicolas-zamudio", "leonel-gonzalez"];

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

  const [service, setService] = useState<Service>(getService(serviceParam) ?? getService("corte-barba") ?? services[0]);
  const [professional, setProfessional] = useState<TeamMember | null>(
    getMember(professionalParam) ?? (hasQuery ? null : (getMember("fernando-lugo") ?? null)),
  );
  const [month, setMonth] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [date, setDate] = useState<Date | null>(hasQuery ? null : initialDate);
  const [time, setTime] = useState<string | null>(hasQuery ? null : "1:00 p.m.");
  const [showAll, setShowAll] = useState(() => Boolean(professionalParam && !primaryPros.includes(professionalParam)));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    document.title = "Reservas | Pompilio's Barber Club";
  }, []);

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
      "PRODID:-//Pompilios Barber Club//ES",
      "BEGIN:VEVENT",
      `DTSTART:${toIcsStamp(start)}`,
      `DTEND:${toIcsStamp(end)}`,
      `SUMMARY:Cita en Pompilio's - ${service.name}`,
      `LOCATION:${branch.address}`,
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
      <PageHero
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Reservas" },
        ]}
        title="Reserva tu cita"
        text="Agenda tu servicio en pocos pasos y vive la experiencia Pompilio's con la misma calidad y detalle."
        image={images.corteBarba}
        imageAlt="Barbero realizando un corte y barba en Pompilio's"
        variant="banner"
      />

      <section className="section booking-section">
        <div className="container">
          <BookingStepper states={states} />
          <div className="booking-layout">
            <article className="panel service-panel">
              <h2>Servicio seleccionado</h2>
              <img src={service.image} alt={service.name} />
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
                  {visiblePros.map((member) => {
                    const selected = professional?.id === member.id;
                    return (
                      <button
                        key={member.id}
                        type="button"
                        className={`pro-card${selected ? " is-selected" : ""}`}
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

              <article className="panel">
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

            <BookingSummary service={service} professional={professional} date={date} time={time} onConfirm={() => setConfirmed(true)} />
          </div>
        </div>
      </section>

      <section className="trust" aria-label="Garantías de tu reserva">
        <div className="container trust-row">
          <article>
            <span className="metric-icon">
              <IconShield />
            </span>
            <div>
              <strong>Reserva segura</strong>
              <span>Tus datos están protegidos.</span>
            </div>
          </article>
          <article>
            <span className="metric-icon">
              <IconBolt />
            </span>
            <div>
              <strong>Confirmación inmediata</strong>
              <span>Recibe la confirmación en segundos.</span>
            </div>
          </article>
          <article>
            <span className="metric-icon">
              <IconPin />
            </span>
            <div>
              <strong>Ubicación conveniente</strong>
              <span>Fácil acceso y estacionamiento.</span>
            </div>
          </article>
        </div>
      </section>

      <Modal open={pickerOpen} title="Elige un servicio" onClose={() => setPickerOpen(false)} wide>
        <div className="picker-grid">
          {services.map((item) => (
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
              <img src={item.image} alt="" />
              <span>
                <strong>{item.name}</strong>
                <small>
                  {item.durationLabel} · {formatPrice(item.price)}
                </small>
              </span>
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={confirmed && ready} title="Tu cita ha sido reservada" onClose={() => setConfirmed(false)}>
        {service && professional && date && time ? (
          <div className="confirm">
            <span className="confirm-badge">
              <IconCheck size={22} />
            </span>
            <p>Te esperamos en Pompilio's Barber Club. Guarda estos datos de tu cita.</p>
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
                <strong>{branch.address}</strong>
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
