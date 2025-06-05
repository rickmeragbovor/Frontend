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

  const navButton =
    "text-red-600 font-semibold hover:underline hover:text-red-700 transition";

  const loginButton =
    "bg-black text-red-600 border border-blue-600 rounded-lg px-4 py-2 font-semibold hover:brightness-110 transition";

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-red-700 font-bold text-2xl">TECHEXPERT</div>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6 text-base">
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
         <Link to="/login" className={loginButton}>
  Se connecter
</Link>

          <button
            onClick={() => handleClick("contact")}
            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
          >
            Contactez-nous
          </button>
        </div>

        {/* Burger menu mobile */}
        <button
          className="md:hidden text-gray-700"
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
          <div className="flex flex-col gap-2 mt-4">
            <button className={loginButton}>Se connecter</button>
            <button
              onClick={() => handleClick("contact")}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
            >
              Contactez-nous
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
