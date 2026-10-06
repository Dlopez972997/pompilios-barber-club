import { useEffect } from "react";
import { images } from "../../assets/images";
import { PageHero } from "../../components/PageHero/PageHero";

const shots = [
  { src: images.hero, alt: "Atención en silla de barbería" },
  { src: images.corte, alt: "Corte de cabello con degradado" },
  { src: images.corteBarba, alt: "Corte y arreglo de barba" },
  { src: images.barba, alt: "Perfilado de barba" },
  { src: images.andres, alt: "Fernando Lugo, barbero principal" },
  { src: images.mateo, alt: "Nicolas Zamudio, barbero" },
  { src: images.sebastian, alt: "Rodolfo Campos, barbero" },
  { src: images.manicure, alt: "Cuidado de manos" },
  { src: images.towels, alt: "Detalle de toallas en el estudio" },
];

export function GalleryPage() {
  useEffect(() => {
    document.title = "Galería | Pompilio's Barber Club";
  }, []);

  return (
    <div className="page page-gallery">
      <PageHero
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Galería" },
        ]}
        title="Galería"
        text="Una mirada a la experiencia, el detalle y el ambiente de Pompilio's Barber Club."
        imageAlt="Ambiente de Pompilio's Barber Club"
      />
      <section className="section">
        <div className="container gallery-grid">
          {shots.map((shot) => (
            <figure key={shot.alt}>
              <img src={shot.src} alt={shot.alt} />
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
