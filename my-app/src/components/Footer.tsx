type FooterProps = {
  onNavigate: (section: string) => void;
};

const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left py-8 px-4">
        {/* Bloc 1 : Représentant */}
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">REPRÉSENTANT</h2>
          <p className="text-lg">
            <span className="font-semibold">Représentant</span><br />
            <span className="text-red-500 font-bold">Roméo ABRENI KOFI DZIDZONU</span><br />
            Email : <a href="mailto:romeoabreni@gmail.com" className="text-gray-300 hover:text-white">romeoabreni@gmail.com</a><br />
            Téléphone : <a href="tel:+0022891087780" className="text-pink-500 hover:text-white">00228 91 08 77 80</a>
          </p>
        </div>

        {/* Bloc 2 : Adresse */}
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">ADRESSE</h2>
          <p className="text-lg">
            Lomé Quartier Amadahomé,<br />
            En face de la station d’essence CAP AMADAHOME<br />
            Site Internet : <a href="http://www.techexpert.tg" className="text-pink-500 hover:text-white">www.techexpert.tg</a><br />
            Email : <a href="mailto:letechexpert@gmail.com" className="text-gray-300 hover:text-white">letechexpert@gmail.com</a><br />
            Téléphone : <a href="tel:+0022890165480" className="text-pink-500 hover:text-white">00228 90 16 54 80</a>
          </p>
        </div>

        {/* Bloc 3 : Navigation */}
        <div className="md:text-right">
          <h3 className="text-2xl font-bold text-red-500 mb-4">Navigation</h3>
          <ul className="space-y-3 text-lg">
            <li>
              <button
                onClick={() => onNavigate("hero")}
                className="text-gray-300 hover:text-red-400 transition duration-300"
              >
                ➤ À propos
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("services")}
                className="text-gray-300 hover:text-red-400 transition duration-300"
              >
                ➤ Services
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("partners")}
                className="text-gray-300 hover:text-red-400 transition duration-300"
              >
                ➤ Partenaires
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("contact")}
                className="text-gray-300 hover:text-red-400 transition duration-300"
              >
                ➤ Contact
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} TECHEXPERT-SARL. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
