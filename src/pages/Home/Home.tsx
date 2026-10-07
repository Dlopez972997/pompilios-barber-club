import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { featuredServices } from "../../data/services";
import { reviews } from "../../data/reviews";
import { branch, reviewStats } from "../../data/site";
import { images } from "../../assets/images";
import heroPhoto from "../../assets/home/pompilios-atelier-hero.jpg";
import { Button } from "../../components/Button/Button";
import { IconChat, IconChevron, IconClock, IconStar, IconTrophy } from "../../components/Icons";
import { Rating } from "../../components/Rating/Rating";
import { ServiceCard } from "../../components/ServiceCard/ServiceCard";

const slides = [
  { src: heroPhoto, alt: "Barbero atendiendo a un cliente en Pompilio's Hair Atelier" },
  { src: images.corte, alt: "Corte de cabello en proceso en Pompilio's Hair Atelier" },
  { src: images.barba, alt: "Arreglo de barba en Pompilio's Hair Atelier" },
];

const steps = [
  { title: "Servicio", text: "Selecciona el servicio que deseas." },
  { title: "Fecha y hora", text: "Elige el día y horario que más te convenga." },
  { title: "Confirmación", text: "Completa tu reserva y listo." },
];

export function HomePage() {
  const [slide, setSlide] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const review = reviews[reviewIndex];

  useEffect(() => {
    document.title = "Pompilio’s Hair Atelier | Barbería en Bogotá";
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  function go(next: number) {
    setSlide((next + slides.length) % slides.length);
  }

  return (
    <div className="page page-home">
      <section className="atelier-hero" aria-roledescription="carrusel">
        {slides.map((item, index) => (
          <img
            key={item.alt}
            className={`atelier-hero-photo${index === slide ? " is-active" : ""}`}
            src={item.src}
            alt={index === slide ? item.alt : ""}
          />
        ))}
        <div className="atelier-hero-shade" />
        <div className="container atelier-hero-layout">
          <div className="atelier-hero-copy">
            <p className="kicker">Hair Atelier</p>
            <h1>
              Cabello,
              <span> forma y criterio.</span>
            </h1>
            <p>
              En Pompilio's Hair Atelier combinamos tradición, estilo y atención al detalle para que siempre te veas y te
              sientas mejor.
            </p>
            <Button to="/reservas" arrow>
              Reservar cita
            </Button>
          </div>
          <aside className="atelier-quote">
            <blockquote>“{reviews[0].text}”</blockquote>
            <p>— {reviews[0].name}</p>
          </aside>
          <div className="atelier-floats" aria-hidden="true">
            <img src={images.corteBarba} alt="" />
            <img src={images.cejas} alt="" />
          </div>
        </div>
        <div className="atelier-controls">
          <button type="button" aria-label="Escena anterior" onClick={() => go(slide - 1)}>
            <IconChevron direction="left" />
          </button>
          <div className="atelier-index">
            {slides.map((item, index) => (
              <button
                key={item.alt}
                type="button"
                className={index === slide ? "is-active" : ""}
                aria-label={`Escena ${index + 1}`}
                aria-current={index === slide ? "true" : undefined}
                onClick={() => go(index)}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <button type="button" aria-label="Escena siguiente" onClick={() => go(slide + 1)}>
            <IconChevron />
          </button>
        </div>
      </section>

      <section className="atelier-steps" aria-label="Cómo reservar">
        <ol>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step.title}</strong>
              <small>{step.text}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="atelier-featured">
        <div className="container atelier-featured-grid">
          <div className="atelier-featured-copy">
            <p className="kicker">Servicios destacados</p>
            <h2>
              Nuestro trabajo,
              <span> tu estilo.</span>
            </h2>
            <p>Servicios de barbería con la calidad y el estilo que nos distingue.</p>
            <Link className="text-link" to="/servicios">
              Ver todos los servicios
              <IconChevron />
            </Link>
          </div>
          <div className="atelier-service-row">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
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

      <section className="atelier-space">
        <img src={images.hero} alt="" />
        <div className="container atelier-space-copy">
          <p className="kicker">Nuestro espacio</p>
          <h2>
            Más que un corte,
            <span> una experiencia.</span>
          </h2>
          <p>Un espacio donde la técnica, el detalle y la estética se encuentran.</p>
          <Button to="/galeria" arrow>
            Conoce nuestro atelier
          </Button>
        </div>
        <aside className="atelier-plaque">
          <span>Estilo</span>
          <span>Técnica</span>
          <span>Personas</span>
          <strong>Un mismo lugar</strong>
        </aside>
      </section>

      <section className="atelier-reviews">
        <div className="container atelier-reviews-grid">
          <h2>
            Lo que dicen
            <span> nuestros clientes.</span>
          </h2>
          <article className="atelier-review">
            <img src={review.image} alt="" />
            <blockquote>“{review.text}”</blockquote>
            <p>
              — {review.name} <Rating value={review.rating} />
            </p>
          </article>
          <div className="atelier-review-nav">
            <button type="button" aria-label="Reseña anterior" onClick={() => setReviewIndex((index) => (index - 1 + reviews.length) % reviews.length)}>
              <IconChevron direction="left" />
            </button>
            <button type="button" aria-label="Reseña siguiente" onClick={() => setReviewIndex((index) => (index + 1) % reviews.length)}>
              <IconChevron />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
