import { useEffect } from "react";
import { Link } from "react-router-dom";
import { featuredServices } from "../../data/services";
import { reviews } from "../../data/reviews";
import { branch, reviewStats } from "../../data/site";
import heroPhoto from "../../assets/home/pompilios-atelier-hero.jpg";
import { Button } from "../../components/Button/Button";
import { IconChat, IconCheck, IconClock, IconStar, IconTrophy } from "../../components/Icons";
import { Rating } from "../../components/Rating/Rating";
import { ServiceCard } from "../../components/ServiceCard/ServiceCard";

const steps = [
  {
    title: "Elige servicio",
    text: "Selecciona el servicio que deseas.",
  },
  {
    title: "Selecciona fecha y hora",
    text: "Elige el día y horario que más te convenga.",
  },
  {
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
            <p className="kicker">Cabello, forma y criterio.</p>
            <h1>
              Más que una barbería,
              <span> una experiencia impecable.</span>
            </h1>
            <p>
              En Pompilio's Hair Atelier combinamos tradición, estilo y atención al detalle para que siempre te veas y te
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
            <img src={heroPhoto} alt="Barbero atendiendo a un cliente en Pompilio's Hair Atelier" />
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

      <section className="section home-featured">
        <div className="container">
          <div className="home-featured-head">
            <div className="section-head">
              <h2>
                Servicios destacados
                <span className="accent-line" />
              </h2>
              <p>Servicios de barbería con la calidad y el estilo que nos distingue.</p>
            </div>
            <Link to="/servicios" className="home-featured-more">
              Ver todos los servicios
              <span aria-hidden="true">→</span>
            </Link>
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
                <span className="how-icon">{index + 1}</span>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.text}</small>
                </span>
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
