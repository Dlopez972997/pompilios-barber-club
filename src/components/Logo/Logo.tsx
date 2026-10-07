import { Link } from "react-router-dom";
import logo from "../../assets/brand/pompilios-hair-atelier.png";

type Props = {
  variant?: "color" | "light";
};

export function Logo({ variant = "color" }: Props) {
  return (
    <Link to="/" className={`logo logo-${variant}`} aria-label="Pompilio's Hair Atelier, ir al inicio">
      <img src={logo} alt="" />
    </Link>
  );
}

export const BrandLogo = Logo;
