import { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Partners from "./components/Partners";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TicketForm from "./pages/TicketForm";
import ConfirmationPage from "./pages/ConfirmationPage";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Ticketing from "./pages/Ticketing";
import Stats from "./pages/Stats";
import GestTech from "./pages/GestTech";
import GestClient from "./pages/GestClient";

function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const partnersRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollToSection = (section: string) => {
    const options: ScrollIntoViewOptions = { behavior: "smooth" };
    switch (section) {
      case "hero":
        heroRef.current?.scrollIntoView(options);
        break;
      case "services":
        servicesRef.current?.scrollIntoView(options);
        break;
      case "partners":
        partnersRef.current?.scrollIntoView(options);
        break;
      case "contact":
        contactRef.current?.scrollIntoView(options);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onNavigate={scrollToSection} />
      <main className="pt-[80px]">
        <section ref={heroRef}>
          <Hero />
        </section>
        <section ref={servicesRef}>
          <Services />
        </section>
        <section ref={partnersRef}>
          <Partners />
        </section>
        <section ref={contactRef}>
          <Contact />
        </section>
        <Footer onNavigate={scrollToSection} />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        {/* ✅ Accès public */}
        <Route path="/" element={<Home />} />
        <Route path="/support" element={<TicketForm />} />
        <Route path="/confirm-cloture/:token" element={<ConfirmationPage />} />

        {/* ✅ Routes publiques protégées */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* ✅ Routes privées */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ticketing"
          element={
            <ProtectedRoute>
              <Ticketing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          }
        />

        {/* ✅ Route réservée aux admin ou superviseur */}
        <Route
          path="/nostechniciens"
          element={
            <ProtectedRoute allowedRoles={["admin", "supérieur"]}>
              <GestTech />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nosclients"
          element={
            <ProtectedRoute allowedRoles={["admin", "supérieur"]}>
              <GestClient />
            </ProtectedRoute>
          }
        />

        {/* Page 404 */}
        <Route
          path="*"
          element={
            <p className="text-center mt-10 text-red-600 text-xl">
              404 - Page non trouvée
            </p>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
