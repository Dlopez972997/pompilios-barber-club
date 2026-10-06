import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { featuredMember, team } from "../../data/team";
import type { TeamGroup, TeamMember } from "../../data/types";
import { Button } from "../../components/Button/Button";
import { IconDiamond, IconHeart, IconSearch, IconStar, IconTrophy, IconUsers } from "../../components/Icons";
import { Modal } from "../../components/Modal/Modal";
import { Rating } from "../../components/Rating/Rating";
import { TeamCard } from "../../components/TeamCard/TeamCard";

const filters: Array<{ id: "all" | TeamGroup; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "barberos", label: "Barberos" },
  { id: "barba", label: "Especialistas en barba" },
  { id: "manicuristas", label: "Manicuristas" },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function TeamPage() {
  const [group, setGroup] = useState<(typeof filters)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState<TeamMember | null>(null);

  useEffect(() => {
    document.title = "Nuestro equipo | Pompilio's Barber Club";
  }, []);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return team.filter((member) => {
      if (group !== "all" && member.group !== group) return false;
      if (q && !normalize(member.name).includes(q)) return false;
      return true;
    });
  }, [group, query]);

  return (
    <div className="page page-team">
      <section className="team-hero">
        <div className="container team-hero-grid">
          <div>
            <nav className="crumbs" aria-label="Ruta de navegación">
              <Link to="/">Inicio</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">Nuestro equipo</span>
            </nav>
            <h1>
              Nuestro <span>equipo</span>
            </h1>
            <p>
              Talento, experiencia y pasión por el detalle. Conoce a los especialistas que hacen única la experiencia en
              Pompilio's Barber Club.
            </p>
            <div className="team-metrics">
              <article>
                <span className="metric-icon">
                  <IconUsers />
                </span>
                <div>
                  <strong>+6</strong>
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
                  <strong>Años de experiencia</strong>
                  <span>Más de 8 años</span>
                </div>
              </article>
            </div>
          </div>

          <article className="featured">
            <img src={featuredMember.image} alt={featuredMember.name} />
            <div>
              <p className="eyebrow">{featuredMember.role}</p>
              <h2>{featuredMember.name}</h2>
              <Rating value={featuredMember.rating} count={featuredMember.reviews} />
              <p>{featuredMember.bio}</p>
              <p className="featured-label">Especialidades:</p>
              <ul className="chips">
                {featuredMember.specialties.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button to={`/reservas?professional=${featuredMember.id}`} arrow>
                Reservar con {featuredMember.firstName}
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="team-head">
            <div>
              <h2>Conoce a nuestro equipo</h2>
              <p>Profesionales apasionados por la barbería, la estética y el bienestar.</p>
            </div>
            <div className="team-tools">
              <div className="pills" role="tablist" aria-label="Filtrar equipo">
                {filters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={group === item.id}
                    className={`pill${group === item.id ? " is-active" : ""}`}
                    onClick={() => setGroup(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <label className="search search-compact">
                <span className="sr-only">Buscar por nombre</span>
                <input
                  type="search"
                  value={query}
                  placeholder="Buscar por nombre..."
                  onChange={(event) => setQuery(event.target.value)}
                />
                <IconSearch />
              </label>
            </div>
          </div>

          <div className="team-grid">
            {visible.map((member) => (
              <TeamCard key={member.id} member={member} onView={setProfile} />
            ))}
          </div>
          {visible.length === 0 ? <p className="empty">No encontramos profesionales con ese nombre.</p> : null}
        </div>
      </section>

      <section className="perks" aria-label="Por qué elegirnos">
        <div className="container perks-row">
          <article>
            <span className="metric-icon">
              <IconDiamond />
            </span>
            <h3>Profesionales certificados</h3>
            <p>Formación constante y las últimas tendencias.</p>
          </article>
          <article>
            <span className="metric-icon">
              <IconHeart />
            </span>
            <h3>Atención personalizada</h3>
            <p>Tu estilo, nuestra prioridad.</p>
          </article>
          <article>
            <span className="metric-icon">
              <IconStar />
            </span>
            <h3>Experiencia que se nota</h3>
            <p>Más de 8 años realzando tu mejor versión.</p>
          </article>
        </div>
      </section>

      <Modal open={Boolean(profile)} title={profile?.name ?? "Perfil"} onClose={() => setProfile(null)}>
        {profile ? (
          <div className="profile">
            <img src={profile.image} alt={profile.name} />
            <div>
              <p className="eyebrow">{profile.role}</p>
              <Rating value={profile.rating} count={profile.reviews} />
              <p>{profile.bio}</p>
              <ul className="chips">
                {profile.specialties.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button to={`/reservas?professional=${profile.id}`} arrow>
                Reservar con {profile.firstName}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
