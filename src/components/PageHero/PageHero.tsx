import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Crumb = { label: string; to?: string };

type Props = {
  crumbs: Crumb[];
  title: ReactNode;
  text: string;
  image: string;
  imageAlt: string;
  variant?: "split" | "banner";
};

export function PageHero({ crumbs, title, text, image, imageAlt, variant = "split" }: Props) {
  return (
    <section className={`page-hero${variant === "banner" ? " is-banner" : ""}`}>
      <div className="container page-hero-grid">
        <div>
          <nav className="crumbs" aria-label="Ruta de navegación">
            {crumbs.map((crumb, index) => (
              <span key={crumb.label}>
                {index > 0 ? <span aria-hidden="true"> / </span> : null}
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
              </span>
            ))}
          </nav>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
        <div className="page-hero-media">
          <img src={image} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}
