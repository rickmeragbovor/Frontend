import { useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Partners from "./components/Partners";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/UI/Login";
import Dashboard from "./pages/UI/Dashboard";
import Statistiques from "./pages/UI/Statistiques";
import Customers from "./pages/UI/Customers";
import Technicians from "./pages/UI/Technicians";
import Ticketing from "./pages/UI/Ticketing";
import Sidebar from "./components/Sidebar";
import Users from "./pages/UI/Users";
import Logiciels from "./pages/UI/Logiciels";
import Ticketform from "./pages/UI/Ticketform";
import ListeTickets from "./components/ticketing/ListeTickets";
import Files from "./pages/UI/Files";

// Page d'accueil
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

// App principale
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
        <Route path="/support" element={<Login />} />
        <Route path="/dashboard" element={<div className="flex h-screen w-screen bg-[#f5f5f5] text-gray-800"><Sidebar/><Outlet/></div>}>
            <Route path="/dashboard/ticketing" element={<Ticketing />}/>
            <Route path="/dashboard/statistiques" element={<Statistiques />}/>
            <Route path="/dashboard/customers" element={<Customers/>}/>
            <Route path="/dashboard/technicians" element={<Technicians/>}/>
            <Route path="/dashboard/users" element={<Users/>}/>
            <Route path="/dashboard/logiciels" element={<Logiciels/>}/>
            <Route path="/dashboard/mes-tickets/nouveau" element={<Ticketform/>}/>
            <Route path="/dashboard/mes-tickets" element={<ListeTickets/>}/>
            <Route path="/dashboard/mes-clients" element={<Customers/>}/>
            <Route path="/dashboard/mes-fichiers" element={<Files/>}/>
            <Route index  element={<Dashboard/>}/>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
