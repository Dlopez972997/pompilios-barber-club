import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/brand/pompilios-hair-atelier.png";
import { branch } from "../../data/site";
import { services } from "../../data/services";
import { team } from "../../data/team";
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
  photoPreview?: string;
  offerImageUpload?: boolean;
  recommendationReason?: string | null;
};

type AdvisorContext = AssistantContext & {
  stage?: "discovery" | "assessment" | "visual_assessment" | "recommendation" | "booking";
  imageAnalysis?: Record<string, unknown> | null;
};

type AdvisorResponse = {
  action: "ASK_FOLLOWUP" | "RECOMMEND" | "BOOK" | "ESCALATE";
  message: string;
  question: string | null;
  quickReplies: string[];
  tips: string[];
  recommendedServiceIds: string[];
  recommendedProfessionalIds: string[];
  recommendationReason: string | null;
  offerImageUpload: boolean;
  safetyEscalation: boolean;
  visualContext: Record<string, unknown> | null;
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

function RecommendationCards({ recommendation, context, reason }: { recommendation: AssistantRecommendation; context?: AssistantContext; reason?: string | null }) {
  const service = recommendation.services[0];
  const professional = recommendation.professionals[0];
  const servicesCategory = service?.category === "barberia" ? "barbería" : service?.category === "unas" ? "uñas" : service?.category;
  return (
    <div className="style-chat-recommendations">
      {(recommendation.consultationValue || context?.problemType) && <div className="style-chat-consultation"><span>{recommendation.consultationLabel ?? "TU CONSULTA"}</span><strong>{recommendation.consultationValue ?? context?.problemType}</strong></div>}
      {recommendation.tip && <aside className="style-chat-tip"><strong><span aria-hidden="true">✦</span> TIP DE POMPILIO’S</strong><p>{recommendation.tip}</p></aside>}
      {service && reason && <p className="style-chat-reason">{reason}</p>}
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
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [context, setContext] = useState<AdvisorContext>({ stage: "discovery" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "assistant", text: openingText }]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrls = useRef(new Set<string>());
  const nextId = useRef(1);
  const fallbackNoticeShown = useRef(false);
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

  useEffect(() => () => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function fileToDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("No se pudo leer la foto."));
      reader.onerror = () => reject(new Error("No se pudo leer la foto."));
      reader.readAsDataURL(file);
    });
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    setUploadError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Elige una foto JPG, PNG o WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("La foto debe pesar máximo 5 MB.");
      return;
    }
    const preview = URL.createObjectURL(file);
    previewUrls.current.add(preview);
    setSelectedImage(file);
    setSelectedImagePreview(preview);
  }

  async function submitMessage(raw: string, image = selectedImage, imagePreview = selectedImagePreview) {
    const text = raw.trim();
    if ((!text && !image) || typing) return;
    const userText = text || "¿Qué puedes observar de este estilo?";
    const detectedIntent = detectAssistantIntent(userText);
    const updatedContext = updateAssistantContext(userText, context);
    const categorySelection = /^(corte|barba|color|uñas|unas)$/i.test(userText);
    const correctionIntent: AssistantContext["intent"] = context.correctionMode && categorySelection
      ? ({ corte: "haircut_problem", barba: "beard_problem", color: "hair_color", uñas: "nails", unas: "nails" } as Record<string, AssistantContext["intent"]>)[userText.toLowerCase()]
      : undefined;
    const resolvedIntent = correctionIntent ?? (detectedIntent === "unknown" ? context.intent : detectedIntent);
    const nextContext: AssistantContext = {
      ...updatedContext,
      intent: resolvedIntent,
      ...(context.correctionMode && !categorySelection && detectedIntent !== "unknown" ? { correctionMode: false } : {}),
    };
    const professional = getProfessionalFromMessage(userText);
    if (professional) nextContext.selectedProfessionalId = professional.id;
    setContext(nextContext);
    setInput("");
    setUploadError("");
    setShowNudge(false);
    const requestImage = image;
    const imageMime = requestImage?.type;
    setSelectedImage(null);
    setSelectedImagePreview(null);
    setMessages((current) => [...current, { id: nextId.current++, role: "user", text, ...(imagePreview ? { photoPreview: imagePreview } : {}) }]);
    setTyping(true);
    setAnalyzingImage(Boolean(requestImage));
    try {
      const fileData = requestImage ? await fileToDataUrl(requestImage) : undefined;
      const apiSetting = import.meta.env.VITE_STYLE_ADVISOR_API_URL?.trim();
      const apiBase = apiSetting ? (/^https?:\/\//i.test(apiSetting) ? apiSetting.replace(/\/$/, "") : `https://${apiSetting.replace(/\/$/, "")}`) : "";
      const history = messages.filter((message) => message.id !== 0).slice(-16).map(({ role, text: messageText }) => ({ role, text: messageText }));
      const response = await fetch(`${apiBase}/api/style-advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, context: nextContext, history, ...(fileData ? { image: { dataUrl: fileData, mimeType: imageMime } } : {}) }),
      });
      if (!response.ok) throw new Error("advisor_unavailable");
      const result = await response.json() as AdvisorResponse;
      const recommendedServices = result.recommendedServiceIds.map((id) => services.find((item) => item.id === id)).filter((item): item is Service => Boolean(item));
      const recommendedPros = result.recommendedProfessionalIds.map((id) => team.find((item) => item.id === id)).filter((item): item is TeamMember => Boolean(item));
      const recommendation: AssistantRecommendation = {
        intent: nextContext.intent ?? "unknown",
        response: result.message,
        followUpOptions: result.quickReplies,
        services: result.action === "RECOMMEND" || result.action === "BOOK" ? recommendedServices : [],
        professionals: result.action === "RECOMMEND" || result.action === "BOOK" ? recommendedPros : [],
        tip: result.tips[0], safe: !result.safetyEscalation, unmatched: false,
        ...(nextContext.problemType ? { consultationLabel: "TU CONSULTA", consultationValue: nextContext.problemType } : {}),
      };
      const nextStage = result.action === "RECOMMEND" ? "recommendation" : result.action === "BOOK" ? "booking" : result.action === "ESCALATE" ? "assessment" : "discovery";
      const finalContext: AdvisorContext = { ...nextContext, stage: nextStage, ...(result.visualContext ? { imageAnalysis: result.visualContext, stage: "visual_assessment" as const } : {}) };
      setContext(finalContext);
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: result.message, recommendation, context: finalContext, offerImageUpload: result.offerImageUpload, recommendationReason: result.recommendationReason }]);
    } catch {
      let fallbackContext: AdvisorContext = { ...nextContext };
      let fallbackRecommendation: AssistantRecommendation;
      const normalizedReply = userText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      if (context.awaitingAnswer === "preserve_length") {
        fallbackContext = { ...fallbackContext, awaitingAnswer: undefined, desiredResult: /^(si\b|quiero conservar|conservar)/.test(normalizedReply) ? "conservar el mayor largo posible" : "priorizar una corrección equilibrada" };
        fallbackRecommendation = recommendStyleService(`${context.problemType ?? "corte"} ${userText} degradado`, fallbackContext);
      } else if (context.awaitingAnswer === "style_goal") {
        fallbackContext = { ...fallbackContext, intent: "haircut_request", desiredResult: fallbackContext.desiredResult ?? userText, awaitingAnswer: "hair_length" };
        fallbackRecommendation = { intent: "haircut_request", response: "¿Qué largo tienes ahora?", followUpOptions: ["Corto", "Medio", "Largo", "No estoy seguro"], services: [], professionals: [], safe: true, unmatched: false };
      } else if (context.awaitingAnswer === "hair_length") {
        fallbackContext = { ...fallbackContext, hairLength: fallbackContext.hairLength ?? userText, awaitingAnswer: "maintenance" };
        fallbackRecommendation = { intent: "haircut_request", response: "¿Cuánto tiempo quieres dedicar al peinado cada día?", followUpOptions: ["Muy poco", "Unos minutos", "Me gusta peinarlo"], services: [], professionals: [], safe: true, unmatched: false };
      } else if (context.awaitingAnswer === "maintenance") {
        fallbackContext = { ...fallbackContext, maintenancePreference: fallbackContext.maintenancePreference ?? userText, awaitingAnswer: undefined };
        fallbackRecommendation = recommendStyleService(userText, fallbackContext);
      } else if (context.awaitingAnswer === "beard_goal") {
        const correction = /correg|disparej|desigual|contorno|hueco|marcacion|perfilad/.test(normalizedReply);
        fallbackContext = { ...fallbackContext, intent: correction ? "beard_problem" : "beard_request", desiredResult: userText, awaitingAnswer: undefined };
        fallbackRecommendation = recommendStyleService(userText, fallbackContext);
      } else if (nextContext.intent === "general_advice" && !context.awaitingAnswer) {
        fallbackContext = { ...fallbackContext, awaitingAnswer: "style_goal" };
        fallbackRecommendation = { intent: "general_advice", response: "¿Qué buscas principalmente con tu estilo?", followUpOptions: ["Clásico", "Moderno", "Fácil de mantener", "Un cambio notable", "No estoy seguro"], services: [], professionals: [], safe: true, unmatched: false };
      } else if (["beard_request", "beard_problem"].includes(nextContext.intent ?? "") && !context.awaitingAnswer && !/perfilad|contorno|largo|forma|mantener|correg/.test(normalizedReply)) {
        fallbackContext = { ...fallbackContext, awaitingAnswer: "beard_goal" };
        fallbackRecommendation = { intent: "beard_request", response: "Claro. ¿Qué te gustaría mejorar o conseguir con tu barba?", followUpOptions: ["Perfilado y contorno", "Ajustar el largo", "Corregir una forma desigual", "Mantenimiento"], services: [], professionals: [], safe: true, unmatched: false };
      } else if (nextContext.intent === "haircut_problem" && /huec|degradad|fade|disparej|desigual|transicion/.test(normalizedReply)) {
        fallbackContext = { ...fallbackContext, awaitingAnswer: "preserve_length" };
        fallbackRecommendation = { intent: "haircut_problem", response: "Entiendo. ¿Quieres conservar el mayor largo posible al corregir esa zona?", followUpOptions: ["Sí, conservar largo", "No importa recortar", "Quiero tu recomendación"], services: [], professionals: [], safe: true, unmatched: false };
      } else {
        fallbackRecommendation = recommendStyleService(userText, fallbackContext);
        if (fallbackRecommendation.followUpOptions?.length && fallbackContext.intent === "haircut_problem" && !fallbackContext.awaitingAnswer) fallbackContext = { ...fallbackContext, awaitingAnswer: "correction_detail" };
      }
      const fallbackText = fallbackNoticeShown.current ? "" : "Ahora mismo no pude completar el análisis. Puedes seguir explorando nuestros servicios o hablar con nosotros por WhatsApp.";
      fallbackNoticeShown.current = true;
      fallbackContext = { ...fallbackContext, stage: fallbackRecommendation.services.length ? "recommendation" : "assessment" };
      setContext(fallbackContext);
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: [fallbackText, fallbackRecommendation.response].filter(Boolean).join(" "), recommendation: fallbackRecommendation, context: fallbackContext, offerImageUpload: !requestImage && Boolean(fallbackRecommendation.followUpOptions) }]);
    } finally {
      setTyping(false);
      setAnalyzingImage(false);
    }
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
            {message.role === "user" && message.photoPreview && <img className="style-chat-user-photo" src={message.photoPreview} alt="Foto adjunta para orientar la asesoría" />}
            {message.role === "assistant" && message.recommendation && <RecommendationCards recommendation={message.recommendation} context={message.context} reason={message.recommendationReason} />}
            {message.role === "assistant" && Boolean(message.recommendation?.followUpOptions?.length) && <div className="style-chat-options">{message.recommendation?.followUpOptions?.map((option) => <button key={option} type="button" onClick={() => submitMessage(option)}>{option}</button>)}</div>}
            {message.role === "assistant" && message.offerImageUpload && <div className="style-chat-photo-offer"><span>Si quieres una orientación más precisa, puedes compartir una foto actual.</span><div><button type="button" onClick={() => fileInputRef.current?.click()}>Subir foto</button><button type="button" onClick={() => submitMessage("Continuar sin foto")}>Continuar sin foto</button></div></div>}
          </div>)}
          {typing && <div className="style-chat-typing" aria-label={analyzingImage ? "Revisando detalles visibles del estilo" : "El asesor está escribiendo"}><i /><i /><i /><span>{analyzingImage ? "Estoy revisando los detalles visibles de tu estilo…" : "No te preocupes, estoy revisando tu consulta…"}</span></div>}
          {initialOnly && !typing && <div className="style-chat-options style-chat-initial-options"><span>¿Qué necesitas hoy?</span>{quickOptions.map((option) => <button key={option} type="button" onClick={() => submitMessage(option)}>{option}</button>)}</div>}
        </div>
        <form className="style-chat-input" onSubmit={handleSubmit}>
          <input ref={fileInputRef} className="style-chat-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} aria-label="Subir foto opcional" />
          {messages.some((message) => message.offerImageUpload) && <button className="style-chat-upload-button" type="button" onClick={() => fileInputRef.current?.click()} aria-label="Adjuntar una foto opcional" title="Adjuntar foto">+</button>}
          <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Cuéntanos qué necesitas…" aria-label="Escribe tu consulta" maxLength={500} />
          <button type="submit" disabled={(!input.trim() && !selectedImage) || typing} aria-label="Enviar mensaje"><IconChevron size={18} /></button>
        </form>
        {selectedImage && <div className="style-chat-image-preview"><img src={selectedImagePreview ?? ""} alt="Vista previa de la foto seleccionada" /><span>{selectedImage.name}</span><button type="button" onClick={() => { setSelectedImage(null); if (selectedImagePreview) { URL.revokeObjectURL(selectedImagePreview); previewUrls.current.delete(selectedImagePreview); } setSelectedImagePreview(null); }}>Quitar</button></div>}
        {uploadError && <p className="style-chat-upload-error" role="alert">{uploadError}</p>}
        <div className="style-chat-footnote">Orientación basada en nuestro catálogo y equipo.</div>
      </section>}
      {!open && showNudge && <button type="button" className="style-chat-nudge" onClick={() => setOpen(true)}>¿No sabes qué servicio elegir?</button>}
      <button type="button" className={`style-chat-launcher${open ? " is-open" : ""}`} onClick={() => { setShowNudge(false); setOpen((value) => !value); }} aria-expanded={open} aria-label={open ? "Cerrar asistente de estilo" : "Abrir asistente de estilo"} title={open ? "Cerrar asistente" : "Abrir asesor de estilo"}>
        {open ? <IconClose size={19} /> : <IconScissors size={22} />}<span>{open ? "Cerrar" : "Asesor de estilo"}</span>
      </button>
    </div>
  );
}
