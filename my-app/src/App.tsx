// src/App.tsx
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

import ProtectedRoute from "./components/ProtectedRoute"; // ✅
import GuestRoute from "./components/GuestRoute"; // ✅

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ticketing from "./pages/Ticketing";
import Stats from "./pages/Stats";

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
        <Route path="/" element={<Home />} />
        <Route path="/ticketing" element={<Ticketing />} />
        <Route path="/stats" element={<Stats/>} />

        {/* ✅ Route login protégée si déjà connecté */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route path="/support" element={<TicketForm />} />

        {/* ✅ Dashboard protégé */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirection de confirmation par email */}
        <Route path="/confirm-cloture/:token" element={<ConfirmationPage />} />

        {/* 404 */}
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
