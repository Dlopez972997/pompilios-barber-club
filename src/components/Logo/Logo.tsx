import { Link } from "react-router-dom";
import { images } from "../../assets/images";

type Props = {
  variant?: "color" | "light";
};

export function Logo({ variant = "color" }: Props) {
  return (
    <Link to="/" className={`logo logo-${variant}`} aria-label="Pompilio's Barber Club, ir al inicio">
      <img src={images.logo} alt="" />
      <span className="logo-word">
        <span className="logo-name">POMPILIO'S</span>
        <span className="logo-sub">
          <span className="logo-rule" aria-hidden="true" />
          <span>BARBER CLUB</span>
          <span className="logo-rule" aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}
