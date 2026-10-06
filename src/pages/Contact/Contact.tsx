import { useEffect, useState, type FormEvent } from "react";
import { branch } from "../../data/site";
import { Button } from "../../components/Button/Button";
import { IconClock, IconPhone, IconPin, IconWhatsapp } from "../../components/Icons";
import { PageHero } from "../../components/PageHero/PageHero";

export function ContactPage() {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "Contacto | Pompilio's Barber Club";
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <div className="page page-contact">
      <PageHero
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Contacto" },
        ]}
        title="Contacto"
        text="Estamos en Ciudad de México para atenderte con la misma calidad y detalle de siempre."
        imageAlt="Pompilio's Barber Club"
      />
      <section className="section">
        <div className="container contact-grid">
          <div className="panel contact-info">
            <h2>Visítanos</h2>
            <p>
              <IconPin />
              <span>{branch.address}</span>
            </p>
            <p>
              <IconClock />
              <span>
                {branch.days}
                <small>{branch.hours}</small>
              </span>
            </p>
            <p>
              <IconPhone />
              <a href={branch.phoneHref}>{branch.phone}</a>
            </p>
            <Button href={branch.whatsapp} external className="btn-wa">
              <IconWhatsapp />
              Escríbenos por WhatsApp
            </Button>
          </div>
          <form className="panel contact-form" onSubmit={onSubmit}>
            <h2>Escríbenos</h2>
            <label>
              Nombre
              <input name="nombre" type="text" required autoComplete="name" />
            </label>
            <label>
              Correo
              <input name="correo" type="email" required autoComplete="email" />
            </label>
            <label>
              Teléfono
              <input name="telefono" type="tel" autoComplete="tel" />
            </label>
            <label>
              Mensaje
              <textarea name="mensaje" rows={5} required />
            </label>
            <Button type="submit">Enviar mensaje</Button>
            {sent ? (
              <p className="form-success" role="status">
                Mensaje enviado. Te contactaremos pronto.
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </div>
  );
}
