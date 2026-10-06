import { Link } from "react-router-dom";
import { branch, navItems, socials } from "../../data/site";
import { IconClock, IconInstagram, IconPhone, IconPin, IconWhatsapp } from "../Icons";
import { Logo } from "../Logo/Logo";

const socialIcon = {
  instagram: IconInstagram,
};

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <Logo variant="light" />
        <div className="footer-contact">
          <p>
            <IconPin />
            <span>{branch.address}</span>
          </p>
          <p>
            <IconClock />
            <span>
              {branch.days} {branch.hours}
              <br />
              {branch.weekend}
            </span>
          </p>
          <p>
            <IconPhone />
            <a href={branch.phoneHref}>{branch.phone}</a>
          </p>
        </div>
        <div className="footer-social">
          <p className="footer-label">Síguenos en redes sociales</p>
          <div className="socials">
            {socials.map((item) => {
              const Icon = socialIcon[item.id as keyof typeof socialIcon];
              return (
                <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
        <div className="footer-links">
          <p className="footer-label">Enlaces rápidos</p>
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-wa">
          <a className="wa-btn" href={branch.whatsapp} target="_blank" rel="noreferrer">
            <IconWhatsapp />
            Escríbenos por WhatsApp
          </a>
          <small>Atención rápida y personalizada.</small>
        </div>
      </div>
    </footer>
  );
}
