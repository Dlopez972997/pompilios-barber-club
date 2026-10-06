import { useEffect, useMemo, useState } from "react";
import { services } from "../../data/services";
import type { ServiceCategory } from "../../data/types";
import { images } from "../../assets/images";
import { Button } from "../../components/Button/Button";
import { IconCalendar, IconChevron, IconClock, IconDiamond, IconSearch } from "../../components/Icons";
import { PageHero } from "../../components/PageHero/PageHero";
import { ServiceCard } from "../../components/ServiceCard/ServiceCard";

const categories: Array<{ id: "all" | ServiceCategory; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "corte", label: "Corte" },
  { id: "barba", label: "Barba" },
  { id: "unas", label: "Uñas" },
];

const reserveSteps = [
  { title: "Elige servicio", text: "Selecciona el servicio que deseas." },
  { title: "Selecciona fecha y hora", text: "Elige el día y horario que más te convenga." },
  { title: "Confirma tu cita", text: "Completa tu reserva y listo." },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function ServicesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]["id"]>("all");
  const [duration, setDuration] = useState("all");
  const [price, setPrice] = useState("all");

  useEffect(() => {
    document.title = "Servicios | Pompilio's Barber Club";
  }, []);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return services.filter((service) => {
      const text = normalize(`${service.name} ${service.description}`);
      if (q && !text.includes(q)) return false;
      if (category !== "all" && !service.categories.includes(category)) return false;
      if (duration === "short" && service.durationMax > 30) return false;
      if (duration === "medium" && !(service.durationMin >= 30 && service.durationMin < 45 && service.durationMax <= 50)) {
        return false;
      }
      if (duration === "long" && service.durationMin < 45) return false;
      if (price === "low" && service.price > 40000) return false;
      if (price === "mid" && (service.price <= 40000 || service.price > 50000)) return false;
      if (price === "high" && service.price <= 50000) return false;
      return true;
    });
  }, [query, category, duration, price]);

  return (
    <div className="page page-services">
      <PageHero
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Servicios" },
        ]}
        title="Servicios"
        text="Servicios de barbería con la calidad, tradición y atención al detalle que nos distingue. Elige tu servicio y vive la experiencia Pompilio's."
        image={images.corte}
        imageAlt="Corte de cabello en proceso en Pompilio's"
      />

      <section className="section services-section">
        <div className="container">
          <div className="toolbar">
            <label className="search">
              <IconSearch />
              <span className="sr-only">Buscar un servicio</span>
              <input
                type="search"
                value={query}
                placeholder="Buscar un servicio..."
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="pills" role="tablist" aria-label="Categorías">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={category === item.id}
                  className={`pill${category === item.id ? " is-active" : ""}`}
                  onClick={() => setCategory(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="filter-select">
              <IconClock size={16} />
              <span>
                <span>Duración</span>
                <select value={duration} aria-label="Filtrar por duración" onChange={(event) => setDuration(event.target.value)}>
                  <option value="all">Todos</option>
                  <option value="short">Hasta 30 min</option>
                  <option value="medium">30 a 45 min</option>
                  <option value="long">Más de 45 min</option>
                </select>
              </span>
              <IconChevron direction="down" />
            </label>
            <label className="filter-select">
              <IconDiamond size={16} />
              <span>
                <span>Precio</span>
                <select value={price} aria-label="Filtrar por precio" onChange={(event) => setPrice(event.target.value)}>
                  <option value="all">Todos</option>
                  <option value="low">Hasta $40.000</option>
                  <option value="mid">$40.000 a $50.000</option>
                  <option value="high">Más de $50.000</option>
                </select>
              </span>
              <IconChevron direction="down" />
            </label>
          </div>

          <div className="services-layout">
            <div className="card-grid card-grid-3">
              {visible.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
              {visible.length === 0 ? (
                <div className="empty">
                  <p>No hay servicios con esos filtros.</p>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => {
                      setQuery("");
                      setCategory("all");
                      setDuration("all");
                      setPrice("all");
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : null}
            </div>
            <aside className="reserve-card">
              <span className="reserve-badge">
                <IconCalendar />
              </span>
              <h2>Reserva en 3 simples pasos</h2>
              <p>Tu próxima experiencia en Pompilio's está a solo unos clics.</p>
              <ol>
                {reserveSteps.map((step, index) => (
                  <li key={step.title}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <small>{step.text}</small>
                    </div>
                  </li>
                ))}
              </ol>
              <Button to="/reservas" full arrow>
                Ir a reservar tu cita
              </Button>
            </aside>
          </div>

          <section className="experience-banner">
            <img src={images.towels} alt="Toallas de Pompilio's Barber Club" />
            <div>
              <p>Tradición · Estilo · Bienestar</p>
              <h2>
                Más que una barbería,
                <span> una experiencia impecable.</span>
              </h2>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
