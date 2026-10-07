import { images } from "../assets/images";
import colorFoils from "../assets/services/color-foils.jpg";
import beardDetail from "../assets/gallery/photo-c1vj.jpg";
import comboBarber from "../assets/gallery/reel-daxh.jpg";
import shortFade from "../assets/gallery/reel-dspm.jpg";
import razorShave from "../assets/gallery/reel-dnro.jpg";
import colorMen from "../assets/services/color-men.jpg";
import colorApplication from "../assets/services/color-application.jpg";
import colorHighlights from "../assets/services/color-highlights.jpg";
import lashesExtensions from "../assets/services/lashes-extensions.jpg";
import lashesDetail from "../assets/services/lashes-detail.jpg";
import makeup from "../assets/services/makeup.jpg";
import makeupEditorial from "../assets/services/makeup-editorial.jpg";
import childrenBraids from "../assets/services/children-braids.jpg";
import childrenStyling from "../assets/services/children-styling.jpg";
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
import waxPaste from "../assets/services/wax-paste.jpg";
import facialCare from "../assets/services/facial-care.jpg";
import facialMassage from "../assets/services/facial-massage.jpg";
import facialRelax from "../assets/services/facial-relax.jpg";
import massageBody from "../assets/services/massage-body.jpg";
import massageBack from "../assets/services/massage-back.jpg";

// Catalog photography is scoped to Services; shared booking/home imagery stays intact.
export const serviceCatalogPhotos: Readonly<Record<string, string>> = {
  "corte": images.corte,
  "corte-y-barba": comboBarber,
  "barba": images.barba,
  "barba-con-marcacion": razorShave,
  "shampoo": wash,
  "corte-barba-y-cejas": images.corteBarba,
  "corte-y-cejas": shortFade,
  "barba-y-cejas": images.barba,
  "cejas-con-cuchilla": images.cejas,
  "manicure-y-pedicure-hombre": images.manicure,
  "depilacion-nariz-y-orejas": beardDetail,
  "keratina-caballeros": washMen,
  "shampoo-normal": wash,
  "tinte-de-barba": images.barba,
  "balayage-cabello-medio": colorFoils,
  "balayage-cabello-corto": colorHighlights,
  "color-caballeros": colorMen,
  "color-base-o-raiz-damas": colorApplication,
  "color-base-y-raiz-damas": colorFoils,
  "depilacion-espalda": waxPaste,
  "depilacion-pecho": waxPaste,
  "barrido-color": colorHighlights,
  "depilacion-axilas": waxPaste,
  "aplicacion-tintura": colorApplication,
  "cambio-esmalte-pies": pedicurePolish,
  "depilacion-cejas": images.cejas,
  "depilacion-brazos": waxPaste,
  "depilacion-nariz": beardDetail,
  "limpieza-facial-completa": facialCare,
  "trenzas": braids,
  "peinados-infantiles": childrenStyling,
  "peinados-ninas-con-accesorios": childrenBraids,
  "maquillaje-halloween": makeupEditorial,
  "pestanas-pelo-a-pelo": lashesExtensions,
  "maquillaje-profesional": makeup,
  "depilacion-orejas-con-depilador": beardDetail,
  "ondulacion-de-cabello": blowdry,
  "cepillado": blowdry,
  "masaje-de-manos": images.manicure,
  "keratina-damas": washCare,
  "pigmento-cejas": images.cejas,
  "cirugia-capilar": washCare,
  "lifting-pestanas": lashesDetail,
  "masaje-facial": facialMassage,
  "pelo-a-pelo": lashesExtensions,
  "depilacion-piernas": waxLegs,
  "limpieza-facial-basica": facialRelax,
  "depilacion-media-pierna": waxLegs,
  "despunte-de-cabello": hairTrim,
  "aplicacion-keratina": washCare,
  "masaje-capilar": washCare,
  "depilacion-pies": waxPaste,
  "hidratacion-capilar": wash,
  "depilacion-bikini": waxTreatment,
  "spa-capilar-botanico": washCare,
  "depilacion-orejas": razorShave,
  "spa-pies": images.pedicure,
  "mascarilla-loreal": washCare,
  "shampoo-y-mascarilla-loreal": wash,
  "depilacion-bigote": waxTreatment,
  "matizante-de-color": colorHighlights,
  "masaje-relajante": massageBody,
  "peinados": styling,
  "cambio-de-esmalte": nailsColor,
  "sesion-de-masaje-reductor": massageBack,
  "recubrimiento-poligel-tradicional": nailsGel,
  "manicure-tradicional": images.manicure,
  "recubriminto-poligel-semipermanente": nailsGel,
  "limp-facial-profunda": facialCare,
  "manicure-polish": manicurePolish,
  "decoracion-unas": nailsArt,
  "manicure-con-parafina": images.manicure,
  "manicure-semipermanente": nailsColor,
  "manicure-y-pedicure-mujer": pedicurePolish,
  "pedicure-hombre": images.pedicure,
  "pedicure-mujer": pedicureCare,
  "depilacion-con-maquina": waxTreatment,
  "pedicure-semipermanente": pedicurePolish,
  "retiro-de-semipermanente": manicurePolish,
  "unas-acrilicas": nailsArt,
  "propina": images.towels,
  "hidratacion-molecular": washCare,
  "limpieza-de-espalda": massageBack,
  "recubrimiento-en-ruber-d-power": nailsGel,
  "shampoo-loreal": wash,
};
