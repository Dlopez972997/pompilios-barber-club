import { images } from "../assets/images";
import colorFoils from "../assets/services/color-foils.jpg";
import beardDetail from "../assets/gallery/photo-c1vj.jpg";
import colorMen from "../assets/services/color-men.jpg";
import colorApplication from "../assets/services/color-application.jpg";
import colorHighlights from "../assets/services/color-highlights.jpg";
import lashesExtensions from "../assets/services/lashes-extensions.jpg";
import lashesDetail from "../assets/services/lashes-detail.jpg";
import makeup from "../assets/services/makeup.jpg";
import makeupEditorial from "../assets/services/makeup-editorial.jpg";
import childrenStyling from "../assets/services/children-styling.jpg";
import childrenAccessories from "../assets/services/children-braids-accessories.webp";
import wash from "../assets/services/wash.jpg";
import washCare from "../assets/services/wash-care.jpg";
import washMen from "../assets/services/wash-men.jpg";
import blowdry from "../assets/services/blowdry.jpg";
import styling from "../assets/services/styling.jpg";
import braids from "../assets/services/braids.jpg";
import hairTrim from "../assets/services/hair-trim.jpg";
import manicurePolish from "../assets/services/manicure-polish.jpg";
import nailsArt from "../assets/services/nails-art.jpg";
import nailsColor from "../assets/services/nails-color.jpg";
import nailsGel from "../assets/services/nails-gel.jpg";
import pedicureCare from "../assets/services/pedicure-care.jpg";
import pedicurePolish from "../assets/services/pedicure-polish.jpg";
import waxTreatment from "../assets/services/wax-treatment.jpg";
import waxLegs from "../assets/services/wax-legs.jpg";
import facialCare from "../assets/services/facial-care.jpg";
import facialMassage from "../assets/services/facial-massage.jpg";
import facialRelax from "../assets/services/facial-relax.jpg";
import massageBody from "../assets/services/massage-body.jpg";
import massageBack from "../assets/services/massage-back.jpg";

type ServicePhoto = { image: string; objectPosition: string };
const photo = (image: string, objectPosition = "center"): ServicePhoto => ({ image, objectPosition });

// Explicit service-by-service assignment. null deliberately renders a category-specific placeholder
// when the project has no photo that accurately depicts that exact procedure.
export const serviceImageMap: Readonly<Record<string, ServicePhoto | null>> = {
  "corte": photo(images.corte, "50% 42%"),
  "corte-y-barba": photo(images.corteBarba, "50% 44%"),
  "barba": photo(images.barba, "50% 48%"),
  "barba-con-marcacion": photo(beardDetail, "55% 45%"),
  "shampoo": photo(washMen, "50% 48%"),
  "corte-barba-y-cejas": null,
  "corte-y-cejas": null,
  "barba-y-cejas": null,
  "cejas-con-cuchilla": null,
  "manicure-y-pedicure-hombre": photo(images.manicure, "50% 52%"),
  "depilacion-nariz-y-orejas": null,
  "keratina-caballeros": null,
  "shampoo-normal": photo(wash, "50% 45%"),
  "tinte-de-barba": null,
  "balayage-cabello-medio": photo(colorFoils, "50% 45%"),
  "balayage-cabello-corto": photo(colorHighlights, "50% 45%"),
  "color-caballeros": photo(colorMen, "50% 42%"),
  "color-base-o-raiz-damas": photo(colorApplication, "50% 42%"),
  "color-base-y-raiz-damas": null,
  "depilacion-espalda": null,
  "depilacion-pecho": null,
  "barrido-color": null,
  "depilacion-axilas": null,
  "aplicacion-tintura": null,
  "cambio-esmalte-pies": photo(pedicurePolish, "50% 50%"),
  "depilacion-cejas": null,
  "depilacion-brazos": null,
  "depilacion-nariz": null,
  "limpieza-facial-completa": photo(facialCare, "50% 45%"),
  "trenzas": photo(braids, "50% 44%"),
  "peinados-infantiles": photo(childrenStyling, "50% 42%"),
  "peinados-ninas-con-accesorios": photo(childrenAccessories, "50% 42%"),
  "maquillaje-halloween": photo(makeupEditorial, "50% 40%"),
  "pestanas-pelo-a-pelo": photo(lashesExtensions, "50% 45%"),
  "maquillaje-profesional": photo(makeup, "50% 45%"),
  "depilacion-orejas-con-depilador": null,
  "ondulacion-de-cabello": null,
  "cepillado": photo(blowdry, "50% 44%"),
  "masaje-de-manos": null,
  "keratina-damas": null,
  "pigmento-cejas": null,
  "cirugia-capilar": null,
  "lifting-pestanas": photo(lashesDetail, "50% 45%"),
  "masaje-facial": photo(facialMassage, "50% 45%"),
  "pelo-a-pelo": null,
  "depilacion-piernas": photo(waxLegs, "50% 50%"),
  "limpieza-facial-basica": photo(facialRelax, "50% 45%"),
  "depilacion-media-pierna": photo(waxTreatment, "50% 52%"),
  "despunte-de-cabello": photo(hairTrim, "50% 45%"),
  "aplicacion-keratina": null,
  "masaje-capilar": null,
  "depilacion-pies": null,
  "hidratacion-capilar": null,
  "depilacion-bikini": null,
  "spa-capilar-botanico": null,
  "depilacion-orejas": null,
  "spa-pies": photo(pedicureCare, "50% 50%"),
  "mascarilla-loreal": null,
  "shampoo-y-mascarilla-loreal": photo(washCare, "50% 45%"),
  "depilacion-bigote": null,
  "matizante-de-color": null,
  "masaje-relajante": photo(massageBody, "50% 46%"),
  "peinados": photo(styling, "50% 44%"),
  "cambio-de-esmalte": null,
  "sesion-de-masaje-reductor": photo(massageBack, "50% 44%"),
  "recubrimiento-poligel-tradicional": photo(nailsGel, "50% 48%"),
  "manicure-tradicional": photo(manicurePolish, "50% 48%"),
  "recubriminto-poligel-semipermanente": null,
  "limp-facial-profunda": null,
  "manicure-polish": photo(nailsColor, "50% 48%"),
  "decoracion-unas": photo(nailsArt, "50% 48%"),
  "manicure-con-parafina": null,
  "manicure-semipermanente": null,
  "manicure-y-pedicure-mujer": null,
  "pedicure-hombre": photo(images.pedicure, "50% 50%"),
  "pedicure-mujer": null,
  "depilacion-con-maquina": null,
  "pedicure-semipermanente": null,
  "retiro-de-semipermanente": null,
  "unas-acrilicas": null,
  "propina": null,
  "hidratacion-molecular": null,
  "limpieza-de-espalda": null,
  "recubrimiento-en-ruber-d-power": null,
  "shampoo-loreal": null,
};

// Kept as an alias for compatibility with the existing Services page import.
export const serviceCatalogPhotos = serviceImageMap;
