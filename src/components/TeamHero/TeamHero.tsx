import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { featuredMember, team } from "../../data/team";
import { Button } from "../Button/Button";
import { IconChevron, IconStar, IconTrophy, IconUsers } from "../Icons";
import { Rating } from "../Rating/Rating";

export function TeamHero() {
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, team.findIndex((member) => member.id === featuredMember.id)));
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  const paused = reducedMotion || hovered || focused || hidden;
  const currentMember = team[activeIndex];

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReducedMotion(motion.matches);
    const onVisibility = () => setHidden(document.hidden);
    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused || team.length < 2) return;
    const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % team.length), 6000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused]);

  function move(direction: number) {
    setActiveIndex((index) => (index + direction + team.length) % team.length);
  }

  return (
      <section className="team-hero team-hero-slider" role="region" aria-roledescription="carrusel" aria-label="Especialistas de Pompilio's" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
        <div className="container team-hero-grid">
          <div className="team-hero-copy">
            <nav className="crumbs" aria-label="Ruta de navegación">
              <Link to="/">Inicio</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">Nuestro equipo</span>
            </nav>
            <h1>
              Talento <span>con criterio.</span>
            </h1>
            <p>
              Talento, experiencia y pasión por el detalle. Conoce a los especialistas que hacen única la experiencia en
              Pompilio's Hair Atelier.
            </p>
            <div className="team-metrics">
              <article>
                <span className="metric-icon">
                  <IconUsers />
                </span>
                <div>
                  <strong>{team.length}</strong>
                  <span>Especialistas</span>
                </div>
              </article>
              <article>
                <span className="metric-icon">
                  <IconStar />
                </span>
                <div>
                  <strong>4.9/5</strong>
                  <span>Calificación promedio</span>
                </div>
              </article>
              <article>
                <span className="metric-icon">
                  <IconTrophy />
                </span>
                <div>
                  <strong>336</strong>
                  <span>Reseñas</span>
                </div>
              </article>
            </div>
          </div>

          <div className="featured-photo" key={`photo-${currentMember.id}`}>
            <img src={currentMember.image} alt={currentMember.name} />
          </div>

          <div className="featured-copy" key={`copy-${currentMember.id}`}>
            <p className="eyebrow">{currentMember.role}</p>
            <h2>{currentMember.name}</h2>
            <Rating value={currentMember.rating} count={currentMember.reviews} />
            {currentMember.bio ? <p>{currentMember.bio}</p> : null}
            {currentMember.specialties && currentMember.specialties.length > 0 ? (
              <>
                <p className="featured-label">Especialidades:</p>
                <ul className="chips">
                  {currentMember.specialties.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}
            <Button to={`/reservas?professional=${currentMember.id}`} arrow>
              Reservar con {currentMember.firstName}
            </Button>
          </div>
          <div className="team-slider-controls">
            <div className="team-slider-navigation" role="group" aria-label="Controles del equipo">
              <button type="button" className="team-slider-arrow" aria-label="Trabajador anterior" onClick={() => move(-1)}><IconChevron direction="left" /></button>
              <span className="team-slider-count" aria-live={paused ? "polite" : "off"} aria-atomic="true">{String(activeIndex + 1).padStart(2, "0")} <span>/ {String(team.length).padStart(2, "0")}</span><span className="sr-only"> · {currentMember.name}, {currentMember.role}</span></span>
              <button type="button" className="team-slider-arrow" aria-label="Trabajador siguiente" onClick={() => move(1)}><IconChevron direction="right" /></button>
            </div>
            <div className="team-slider-dots" role="group" aria-label="Elegir trabajador">
              {team.map((member, index) => (
                <button key={member.id} type="button" aria-label={`Mostrar a ${member.name}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)}><span /></button>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}
