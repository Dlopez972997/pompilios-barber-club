import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gallery, instagramUrl, type GalleryItem } from "../../data/gallery";
import { IconClose, IconInstagram } from "../../components/Icons";

export function GalleryPage() {
  const [active, setActive] = useState<number | null>(null);
  const item = active != null ? gallery[active] : null;

  useEffect(() => {
    document.title = "Galería | Pompilio's Hair Atelier";
  }, []);

  useEffect(() => {
    if (active == null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((index) => (index == null ? index : (index + 1) % gallery.length));
      if (event.key === "ArrowLeft") {
        setActive((index) => (index == null ? index : (index - 1 + gallery.length) % gallery.length));
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  function open(index: number) {
    setActive(index);
  }

  return (
    <div className="page page-gallery">
      <section className="gallery-intro">
        <div className="container">
          <nav className="crumbs" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Galería</span>
          </nav>
          <h1>Galería</h1>
          <p>Una mirada a la experiencia, el detalle y el ambiente de Pompilio's Hair Atelier.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="gallery-grid">
            {gallery.map((shot, index) => (
              <button key={shot.id} type="button" className="gallery-item" aria-label={shot.alt} onClick={() => open(index)}>
                <img src={shot.image} alt="" />
                <span className="gallery-badge" aria-hidden="true">{shot.kind === "reel" ? "Reel" : "Foto"}</span>
              </button>
            ))}
          </div>
          <div className="gallery-foot">
            <a className="btn btn-primary" href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <IconInstagram />
              Síguenos en Instagram
            </a>
          </div>
        </div>
      </section>

      {item ? (
        <Lightbox
          item={item}
          onClose={() => setActive(null)}
          onPrev={() => setActive((index) => (index == null ? index : (index - 1 + gallery.length) % gallery.length))}
          onNext={() => setActive((index) => (index == null ? index : (index + 1) % gallery.length))}
        />
      ) : null}
    </div>
  );
}

function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="lightbox" role="presentation" onClick={onClose}>
      <button type="button" className="lightbox-nav" aria-label="Anterior" onClick={(event) => { event.stopPropagation(); onPrev(); }}>
        ‹
      </button>
      <div
        className="lightbox-panel"
        role="dialog"
        aria-modal="true"
        aria-label={item.alt}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="lightbox-close" aria-label="Cerrar" onClick={onClose}>
          <IconClose />
        </button>
        <img src={item.image} alt={item.alt} />
        {item.kind === "reel" ? (
          <a className="btn btn-primary" href={item.href} target="_blank" rel="noopener noreferrer">
            Ver reel en Instagram
          </a>
        ) : (
          <a className="btn btn-outline" href={item.href} target="_blank" rel="noopener noreferrer">
            Ver publicación
          </a>
        )}
      </div>
      <button type="button" className="lightbox-nav" aria-label="Siguiente" onClick={(event) => { event.stopPropagation(); onNext(); }}>
        ›
      </button>
    </div>
  );
}
