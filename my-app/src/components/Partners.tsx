import Partner1Logo from '../assets/logos/Tomate.png';
import Partner2Logo from '../assets/logos/Alphorm.png';
import Partner3Logo from '../assets/logos/Dimo.png';

const Partners = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Nos Partenaires</h2>
        <p className="text-gray-600 text-lg mb-12 leading-relaxed">
          Nous développons des logiciels sur mesure pour accompagner les entreprises dans leur
          transformation numérique : gestion, automatisation, reporting et bien plus encore.
        </p>

        {/* ✅ Logos des partenaires */}
        <div className="flex flex-wrap justify-center gap-10 items-center">
          <a href="https://www.tomate.com" target="_blank" rel="noopener noreferrer">
            <img src={Partner1Logo} alt="AD Partner" className="h-20 w-auto hover:scale-105 transition" />
          </a>
          <a href="https://www.alphorm.com" target="_blank" rel="noopener noreferrer">
            <img src={Partner2Logo} alt="Alphorm" className="h-20 w-auto hover:scale-105 transition" />
          </a>
          <a href="https://www.dimomaint.com" target="_blank" rel="noopener noreferrer">
            <img src={Partner3Logo} alt="DimoMaint" className="h-20 w-auto hover:scale-105 transition" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Partners;
