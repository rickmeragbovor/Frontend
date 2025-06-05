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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
