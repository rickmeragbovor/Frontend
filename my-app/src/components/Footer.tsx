type FooterProps = {
  onNavigate: (section: string) => void;
};

const Footer = ({ onNavigate }: FooterProps) => {
  const navSections = [
    { id: "hero", label: "À propos" },
    { id: "services", label: "Services" },
    { id: "partners", label: "Partenaires" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center md:justify-between gap-10 md:gap-0 text-center md:text-left">
        {/* Bloc 1 : Représentant */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-red-500 mb-4">REPRESENTANT</h2>
          <p className="text-lg leading-relaxed">
            <span className="font-semibold">Représentant</span><br />
            <span className="text-red-500 font-bold">Roméo ABRENI KOFI DZIDZONU</span><br />
            Email :{" "}
            <a
              href="mailto:romeoabreni@gmail.com"
              className="text-gray-300 hover:text-white transition"
            >
              romeoabreni@gmail.com
            </a>
            <br />
            Téléphone :{" "}
            <a
              href="tel:+0022891087780"
              className="text-pink-500 hover:text-white transition"
            >
              00228 91 08 77 80
            </a>
          </p>
        </div>

        {/* Bloc 2 : Adresse */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-red-500 mb-4"md:text-center>ADRESSE</h2>
          <p className="text-lg leading-relaxed">
            Lomé Quartier Amadahomé,<br />
            En face de la station d’essence CAP AMADAHOME<br />
            Site Internet :{" "}
            <a
              href="http://www.techexpert.tg"
              className="text-pink-500 hover:text-white transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.techexpert.tg
            </a>
            <br />
            Email :{" "}
            <a
              href="mailto:letechexpert@gmail.com"
              className="text-gray-300 hover:text-white transition"
            >
              letechexpert@gmail.com
            </a>
            <br />
            Téléphone :{" "}
            <a
              href="tel:+0022890165480"
              className="text-pink-500 hover:text-white transition"
            >
              00228 90 16 54 80
            </a>
          </p>
        </div>

        {/* Bloc 3 : Navigation */}
        <div className="flex-1/2 md:text-left">
          <h3 className="text-2xl font-bold text-red-500 mb-6">Navigation</h3>
          <ul className="space-y-3 text-lg max-w-xs mx-auto md:mx-0">
            {navSections.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => onNavigate(id)}
                  className="w-full text-gray-300 hover:text-red-400 transition duration-300 text-left md:text-right"
                >
                  ➤ {label}
                </button>
              </li>
            ))}
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
