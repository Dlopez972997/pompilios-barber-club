import { useEffect, useMemo, useState } from "react";
import { team } from "../../data/team";
import type { TeamMember } from "../../data/types";
import { Button } from "../../components/Button/Button";
import { IconDiamond, IconHeart, IconSearch, IconStar } from "../../components/Icons";
import { Modal } from "../../components/Modal/Modal";
import { Rating } from "../../components/Rating/Rating";
import { TeamCard } from "../../components/TeamCard/TeamCard";
import { TeamHero } from "../../components/TeamHero/TeamHero";

const filters = (
  [
    { id: "all", label: "Todos" },
    { id: "barberos", label: "Barberos" },
    { id: "manicuristas", label: "Manicuristas" },
    { id: "integrales", label: "Estilistas integrales" },
  ] as const
).filter((item) => item.id === "all" || team.some((member) => member.group === item.id));

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
    document.title = "Nuestro equipo | Pompilio's Hair Atelier";
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
      <TeamHero />

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
            {visible.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} onView={setProfile} />
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
            <h3>Equipo de la casa</h3>
            <p>Quienes atienden en Pompilio's Hair Atelier.</p>
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
            <p>El detalle de cada cita, en la silla.</p>
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
              {profile.bio ? <p>{profile.bio}</p> : null}
              {profile.specialties && profile.specialties.length > 0 ? (
                <ul className="chips">
                  {profile.specialties.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
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
