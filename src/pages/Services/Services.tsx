import { useEffect, useMemo, useState } from "react";
import { serviceCategories, services } from "../../data/services";
import { images } from "../../assets/images";
import { serviceCatalogPhotos } from "../../data/serviceCatalogPhotos";
import { Button } from "../../components/Button/Button";
import { IconClock, IconDiamond, IconSearch } from "../../components/Icons";
import { PageHero } from "../../components/PageHero/PageHero";
import { ServiceCard } from "../../components/ServiceCard/ServiceCard";

const pageSize = 12;

const categories = [{ id: "all" as const, label: "Todos" }, ...serviceCategories];

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
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "Servicios | Pompilio's Hair Atelier";
  }, []);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return services.filter((service) => {
      const text = normalize(`${service.name} ${service.description}`);
      if (q && !text.includes(q)) return false;
      if (category !== "all" && service.category !== category) return false;
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

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [query, category, duration, price]);

  useEffect(() => {
    const node = document.querySelector(".page-services .reserve-card");
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.classList.add("is-in");
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page page-services">
      <div className="services-hero">
        <PageHero
          crumbs={[
            { label: "Inicio", to: "/" },
            { label: "Servicios" },
          ]}
          title={
            <>
              Servicios
              <span> con criterio.</span>
            </>
          }
          text="Servicios de barbería con la calidad, tradición y atención al detalle que nos distingue. Elige tu servicio y vive la experiencia Pompilio's."
          image={images.corte}
          imageAlt="Corte de cabello en proceso en Pompilio's"
        />
        <p className="services-hero-mark" aria-hidden="true">
          <span>Estilo</span>
          <span>Técnica</span>
          <span>Detalle</span>
        </p>
      </div>

      <section className="section services-section">
        <div className="container">
          <div className="toolbar">
            <label className="search">
              <IconSearch />
              <span className="sr-only">Buscar un servicio</span>
              <input
                type="search"
                value={query}
                placeholder="Buscar servicio..."
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
            <div className="services-filters">
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
              </label>
              <p className="catalog-count">
                {visible.length === services.length
                  ? `${services.length} servicios`
                  : `${visible.length} de ${services.length} servicios`}
              </p>
            </div>
          </div>

          <div className="services-layout">
            <div>
              <div className="card-grid card-grid-3">
                {pageItems.map((service) => (
                  <ServiceCard key={service.id} service={{ ...service, image: serviceCatalogPhotos[service.id] ?? service.image }} />
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
              {pageCount > 1 ? (
                <nav className="pager" aria-label="Páginas de servicios">
                  <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                    Anterior
                  </button>
                  {Array.from({ length: pageCount }, (_, index) => {
                    const number = index + 1;
                    return (
                      <button
                        key={number}
                        type="button"
                        aria-current={number === currentPage ? "page" : undefined}
                        className={number === currentPage ? "is-active" : ""}
                        onClick={() => setPage(number)}
                      >
                        {number}
                      </button>
                    );
                  })}
                  <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>
                    Siguiente
                  </button>
                </nav>
              ) : null}
            </div>
            <aside className="reserve-card">
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

        </div>
        <section className="services-perks" aria-label="Beneficios">
          <ul className="container services-perks-row">
            <li>
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  d="M8 4.5 5 8l3 2 2-2 6 6 2-2-6-6 2-2-3.5-3.5L8 4.5Zm8 8-6 6 1.5 1.5 6-6L16 12.5Z"
                />
              </svg>
              <div>
                <strong>Técnica profesional</strong>
                <span>Resultados con criterio.</span>
              </div>
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  d="M6 11V7.5A2.5 2.5 0 0 1 8.5 5h7A2.5 2.5 0 0 1 18 7.5V11M4 11h16v3.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V11Zm3 6.5V20m10-2.5V20"
                />
              </svg>
              <div>
                <strong>Ambiente de primera</strong>
                <span>Un espacio pensado para ti.</span>
              </div>
            </li>
            <li>
              <IconDiamond size={28} />
              <div>
                <strong>Cuidado en cada detalle</strong>
                <span>Más que un servicio, una experiencia.</span>
              </div>
            </li>
          </ul>
        </section>
      </section>
    </div>
  );
}
