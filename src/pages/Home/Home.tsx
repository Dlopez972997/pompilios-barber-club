import { useEffect } from "react";
import { featuredServices } from "../../data/services";
import { reviews } from "../../data/reviews";
import { branch, reviewStats } from "../../data/site";
import heroPhoto from "../../assets/home/pompilios-hero.jpg";
import { Button } from "../../components/Button/Button";
import { IconCalendar, IconChat, IconCheck, IconChevron, IconClock, IconStar, IconTrophy } from "../../components/Icons";
import { Rating } from "../../components/Rating/Rating";
import { ServiceCard } from "../../components/ServiceCard/ServiceCard";

const steps = [
  {
    icon: IconCalendar,
    title: "Elige servicio",
    text: "Selecciona el servicio que deseas.",
  },
  {
    icon: IconClock,
    title: "Selecciona fecha y hora",
    text: "Elige el día y horario que más te convenga.",
  },
  {
    icon: IconCheck,
    title: "Confirma tu cita",
    text: "Completa tu reserva y listo.",
  },
];

export function HomePage() {
  useEffect(() => {
    document.title = "Pompilio’s Hair Atelier | Barbería en Bogotá";
  }, []);

  return (
    <div className="page page-home">
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <p className="kicker">Tradición · Estilo · Bienestar</p>
            <h1>
              Más que una barbería,
              <span> una experiencia impecable.</span>
            </h1>
            <p>
              En Pompilio's Barber Club combinamos tradición, estilo y atención al detalle para que siempre te veas y te
              sientas mejor.
            </p>
            <div className="hero-actions">
              <Button to="/reservas" arrow>
                Reservar cita ahora
              </Button>
              <Button to="/servicios" variant="outline">
                Ver servicios
              </Button>
            </div>
          </div>
          <div className="home-hero-media">
            <img src={heroPhoto} alt="Barbero atendiendo a un cliente en Pompilio's Barber Club" />
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Indicadores">
        <div className="container metrics-row">
          <article>
            <span className="metric-icon">
              <IconChat />
            </span>
            <div>
              <strong>{reviewStats.count}</strong>
              <span>Reseñas de clientes</span>
            </div>
          </article>
          <article>
            <span className="metric-icon">
              <IconStar />
            </span>
            <div>
              <strong>{reviewStats.average}</strong>
              <span>Calificación promedio</span>
            </div>
          </article>
          <article>
            <span className="metric-icon">
              <IconTrophy />
            </span>
            <div>
              <strong>Años de experiencia</strong>
              <span>Más de 8 años</span>
            </div>
          </article>
          <article>
            <span className="metric-icon">
              <IconClock />
            </span>
            <div>
              <strong>{branch.days}</strong>
              <span>{branch.hours}</span>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Servicios destacados</h2>
            <p>Servicios de barbería con la calidad y el estilo que nos distingue.</p>
            <span className="accent-line" />
          </div>
          <div className="card-grid card-grid-3">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section how-section">
        <div className="container how">
          <div className="how-copy">
            <h2>Cómo reservar</h2>
            <p>Tu próxima experiencia en Pompilio's en solo 3 pasos.</p>
          </div>
          <ol className="how-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="how-icon">
                  <step.icon size={18} />
                </span>
                <span>
                  <strong>
                    {index + 1}. {step.title}
                  </strong>
                  <small>{step.text}</small>
                </span>
                {index < steps.length - 1 ? (
                  <span className="how-sep" aria-hidden="true">
                    <IconChevron />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <Button to="/reservas" arrow>
            Reservar cita ahora
          </Button>
        </div>
      </section>

      <section className="section reviews-section">
        <div className="container">
          <div className="section-head">
            <h2>Reseñas reales</h2>
            <p>La confianza de nuestros clientes nos impulsa a ser mejores cada día.</p>
          </div>
          <div className="review-grid">
            {reviews.map((review) => (
              <article key={review.id} className="review-card">
                <img src={review.image} alt="" />
                <div>
                  <Rating value={review.rating} />
                  <blockquote>“{review.text}”</blockquote>
                  <p className="review-name">
                    {review.name}
                    <IconCheck size={14} />
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
