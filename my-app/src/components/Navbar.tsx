import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  onNavigate: (section: string) => void;
};

const Navbar = ({ onNavigate }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (section: string) => {
    onNavigate(section);
    setIsMenuOpen(false);
  };

  // Styles des boutons
  const navButton =
    "text-red-500 font-medium hover:underline hover:text-red-600 transition bg-transparent";

  const loginButton =
    "text-red-500 border border-red-400 rounded-lg px-4 py-2 font-semibold hover:bg-red-100 hover:border-red-500 transition";

  const contactButton =
    "bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold hover:bg-red-200 transition";

  const supportButton =
    "bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold hover:bg-red-200 transition";

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-red-600 font-bold text-2xl tracking-wide">TECHEXPERT</div>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-8 text-base">
          <button onClick={() => handleClick("hero")} className={navButton}>
            À propos
          </button>
          <button onClick={() => handleClick("services")} className={navButton}>
            Services
          </button>
          <button onClick={() => handleClick("partners")} className={navButton}>
            Partenaires
          </button>
        </nav>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => handleClick("contact")} className={contactButton}>
            Contactez-nous
          </button>
          {/* ✅ Lien vers la page support */}
          <Link to="/support" className={supportButton}>
            Support
          </Link>
          <Link to="/login" className={loginButton}>
            Se connecter
          </Link>
        </div>

        {/* Burger menu mobile */}
        <button
          className="md:hidden text-gray-700 hover:text-red-600 transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden px-6 py-4 space-y-4 bg-white shadow-md border-t border-gray-200">
          <button onClick={() => handleClick("hero")} className={navButton}>
            À propos
          </button>
          <button onClick={() => handleClick("services")} className={navButton}>
            Services
          </button>
          <button onClick={() => handleClick("partners")} className={navButton}>
            Partenaires
          </button>

          <div className="flex flex-col gap-3 mt-6">
            <button onClick={() => handleClick("contact")} className={contactButton}>
              Contactez-nous
            </button>
            {/* ✅ Support mobile */}
            <Link to="/support" className={supportButton}>
              Support
            </Link>
            <Link to="/login" className={loginButton}>
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
