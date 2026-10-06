import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { BookingPage } from "./pages/Booking/Booking";
import { ContactPage } from "./pages/Contact/Contact";
import { GalleryPage } from "./pages/Gallery/Gallery";
import { HomePage } from "./pages/Home/Home";
import { ServicesPage } from "./pages/Services/Services";
import { TeamPage } from "./pages/Team/Team";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="servicios" element={<ServicesPage />} />
          <Route path="equipo" element={<TeamPage />} />
          <Route path="reservas" element={<BookingPage />} />
          <Route path="galeria" element={<GalleryPage />} />
          <Route path="contacto" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
