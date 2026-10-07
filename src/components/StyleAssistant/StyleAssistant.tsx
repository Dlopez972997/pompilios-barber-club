import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/brand/pompilios-hair-atelier.png";
import { branch } from "../../data/site";
import type { Service, TeamMember } from "../../data/types";
import { formatPrice } from "../../utils/dates";
import { IconChevron, IconClose, IconScissors } from "../Icons";
import { Rating } from "../Rating/Rating";
import { detectAssistantIntent, recommendStyleService, type AssistantRecommendation } from "../../data/chatRecommendationEngine";
import { getProfessionalFromMessage, updateAssistantContext, type AssistantContext } from "../../data/chatDataAdapter";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
  recommendation?: AssistantRecommendation;
  context?: AssistantContext;
};

const openingText = "Hola, soy tu asesor de estilo de Pompilio’s. Cuéntame qué buscas o qué te gustaría corregir y lo revisamos juntos.";
const quickOptions = ["Corte", "Barba", "Color", "Uñas", "Niños", "Corregir un servicio", "Quiero asesoría"];
const bookingUrl = (service: Service, professional?: TeamMember) => {
  const query = new URLSearchParams({ service: service.slug, ...(professional ? { professional: professional.id } : {}) });
  return `/reservas?${query.toString()}`;
};

function ServiceRecommendation({ service, professional }: { service: Service; professional?: TeamMember }) {
  return (
    <article className="style-chat-service">
      {service.image ? <img src={service.image} alt={service.name} /> : <div className="style-chat-image-empty" aria-hidden="true" />}
      <div className="style-chat-card-copy">
        <span className="style-chat-recommended-label">RECOMENDADO PARA TU CASO</span>
        <h3>{service.name}</h3>
        <p><span className="style-chat-duration">{service.durationLabel || "Duración no indicada"}</span><strong>{formatPrice(service.price)}{service.priceFrom ? " en adelante" : ""}</strong></p>
        <div className="style-chat-service-actions">
          <Link to={`/servicios#service-${service.slug}`} className="style-chat-card-link">Ver servicio</Link>
          <Link to={bookingUrl(service, professional)} className="style-chat-card-book">Reservar</Link>
        </div>
      </div>
    </article>
  );
}

function professionalReason(member: TeamMember, service: Service) {
  if (member.group === "barberos" && ["barberia", "combos"].includes(service.category)) return `Su rol registrado como ${member.role} coincide con esta categoría.`;
  if (member.group === "manicuristas" && service.category === "unas") return `Su rol registrado como ${member.role} coincide con este servicio.`;
  if (member.group === "integrales" && ["color", "mujer", "pestanas", "maquillaje", "spa", "tratamientos", "ninos"].includes(service.category)) return `Su rol registrado como ${member.role} está relacionado con esta categoría.`;
  return `Su perfil está en el equipo de Pompilio’s; consulta con nosotros si necesitas confirmar el servicio.`;
}

function ProfessionalRecommendation({ member, service }: { member: TeamMember; service: Service }) {
  return (
    <article className="style-chat-pro">
      <img src={member.image} alt={member.name} />
      <div className="style-chat-pro-copy">
        <strong>{member.name}</strong>
        <span>{member.role}</span>
        {member.rating !== undefined && <Rating value={member.rating} />}
        <small>{professionalReason(member, service)}</small>
      </div>
      <Link to={bookingUrl(service, member)} className="style-chat-book">Reservar con {member.firstName}</Link>
    </article>
  );
}

function RecommendationCards({ recommendation, context }: { recommendation: AssistantRecommendation; context?: AssistantContext }) {
  const service = recommendation.services[0];
  const professional = recommendation.professionals[0];
  const servicesCategory = service?.category === "barberia" ? "barbería" : service?.category === "unas" ? "uñas" : service?.category;
  return (
    <div className="style-chat-recommendations">
      {(recommendation.consultationValue || context?.problemType) && <div className="style-chat-consultation"><span>{recommendation.consultationLabel ?? "TU CONSULTA"}</span><strong>{recommendation.consultationValue ?? context?.problemType}</strong></div>}
      {recommendation.tip && <aside className="style-chat-tip"><strong><span aria-hidden="true">✦</span> TIP DE POMPILIO’S</strong><p>{recommendation.tip}</p></aside>}
      {service && <>
        <p className="style-chat-section-label">Servicio recomendado</p>
        <ServiceRecommendation service={service} professional={professional} />
      </>}
      {service && recommendation.professionals.length > 0 && <>
        <p className="style-chat-section-label">Profesional recomendado</p>
        <div className="style-chat-pro-list">{recommendation.professionals.map((member) => <ProfessionalRecommendation key={member.id} member={member} service={service} />)}</div>
      </>}
      {service && <section className="style-chat-summary">
        <strong>Esto es lo que te recomiendo</strong>
        {context?.problemType && <span><b>Consulta:</b> {context.problemType}</span>}
        <span><b>Servicio:</b> {service.name}</span>
        {professional && <span><b>Profesional:</b> {professional.name}, {professional.role}</span>}
        {context?.desiredResult && <span><b>Objetivo:</b> {context.desiredResult}</span>}
        {context?.previousService && <span><b>Servicio anterior:</b> {context.previousService}</span>}
        {context?.hairLength && <span><b>Largo indicado:</b> {context.hairLength}</span>}
        {context?.hairType && <span><b>Tipo de cabello:</b> {context.hairType}</span>}
        {context?.urgency && <span><b>Nota:</b> el equipo podrá mostrarte los horarios disponibles al reservar.</span>}
        {servicesCategory && <Link to={bookingUrl(service, professional)} className="style-chat-summary-cta">Reservar cita <IconChevron size={14} /></Link>}
      </section>}
      {recommendation.unmatched && <a className="style-chat-whatsapp" href={branch.whatsapp} target="_blank" rel="noopener noreferrer">Confirmar con el equipo por WhatsApp <IconChevron size={14} /></a>}
    </div>
  );
}

export function StyleAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [context, setContext] = useState<AssistantContext>({});
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "assistant", text: openingText }]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setShowNudge(false);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, typing]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowNudge(true), 6500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => () => { if (replyTimer.current) window.clearTimeout(replyTimer.current); }, []);

  function submitMessage(raw: string) {
    const text = raw.trim();
    if (!text || typing) return;
    const detectedIntent = detectAssistantIntent(text);
    const updatedContext = updateAssistantContext(text, context);
    const categorySelection = /^(corte|barba|color|uñas|unas)$/i.test(text);
    const correctionIntent: AssistantContext["intent"] = context.correctionMode && categorySelection
      ? ({ corte: "haircut_problem", barba: "beard_problem", color: "hair_color", uñas: "nails", unas: "nails" } as Record<string, AssistantContext["intent"]>)[text.toLowerCase()]
      : undefined;
    const resolvedIntent = correctionIntent ?? (detectedIntent === "unknown" ? context.intent : detectedIntent);
    const nextContext: AssistantContext = {
      ...updatedContext,
      intent: resolvedIntent,
      ...(context.correctionMode && !categorySelection && detectedIntent !== "unknown" ? { correctionMode: false } : {}),
    };
    const recommendation = recommendStyleService(text, nextContext);
    const professional = getProfessionalFromMessage(text);
    if (professional) nextContext.selectedProfessionalId = professional.id;
    if (recommendation.intent !== "unknown") nextContext.intent = recommendation.intent;
    setContext(nextContext);
    setInput("");
    setShowNudge(false);
    setMessages((current) => [...current, { id: nextId.current++, role: "user", text }]);
    setTyping(true);
    replyTimer.current = window.setTimeout(() => {
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: recommendation.response, recommendation, context: nextContext }]);
      setTyping(false);
    }, 420);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage(input);
  }

  const initialOnly = messages.length === 1;
  return (
    <div className="style-assistant-root">
      {open && <section className="style-chat-window" role="dialog" aria-modal="false" aria-label="Asesor de estilo Pompilio’s">
        <header className="style-chat-header">
          <img src={logo} alt="" />
          <div><strong>Asesor Pompilio’s</strong><span>Estilo y cuidado personalizado</span></div>
          <span className="style-chat-available"><i aria-hidden="true" />Disponible</span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar asistente"><IconClose size={18} /></button>
        </header>
        <div className="style-chat-messages" ref={scrollRef} aria-live="polite">
          {messages.map((message) => <div key={message.id} className={`style-chat-message-row is-${message.role}`}>
            <div className={`style-chat-bubble is-${message.role}`}>{message.text}</div>
            {message.role === "assistant" && message.recommendation && <RecommendationCards recommendation={message.recommendation} context={message.context} />}
            {message.role === "assistant" && message.recommendation?.followUpOptions && <div className="style-chat-options">{message.recommendation.followUpOptions.map((option) => <button key={option} type="button" onClick={() => submitMessage(option)}>{option}</button>)}</div>}
          </div>)}
          {typing && <div className="style-chat-typing" aria-label="El asesor está escribiendo"><i /><i /><i /></div>}
          {initialOnly && !typing && <div className="style-chat-options style-chat-initial-options"><span>¿Qué necesitas hoy?</span>{quickOptions.map((option) => <button key={option} type="button" onClick={() => submitMessage(option)}>{option}</button>)}</div>}
        </div>
        <form className="style-chat-input" onSubmit={handleSubmit}>
          <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Cuéntanos qué necesitas…" aria-label="Escribe tu consulta" maxLength={500} />
          <button type="submit" disabled={!input.trim() || typing} aria-label="Enviar mensaje"><IconChevron size={18} /></button>
        </form>
        <div className="style-chat-footnote">Orientación basada en nuestro catálogo y equipo.</div>
      </section>}
      {!open && showNudge && <button type="button" className="style-chat-nudge" onClick={() => setOpen(true)}>¿No sabes qué servicio elegir?</button>}
      <button type="button" className={`style-chat-launcher${open ? " is-open" : ""}`} onClick={() => { setShowNudge(false); setOpen((value) => !value); }} aria-expanded={open} aria-label={open ? "Cerrar asistente de estilo" : "Abrir asistente de estilo"} title={open ? "Cerrar asistente" : "Abrir asesor de estilo"}>
        {open ? <IconClose size={19} /> : <IconScissors size={22} />}<span>{open ? "Cerrar" : "Asesor de estilo"}</span>
      </button>
    </div>
  );
}
