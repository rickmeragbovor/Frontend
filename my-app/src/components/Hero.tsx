import hero from "@/assets/Hero.png";

const Hero = () => {
  return (
    <main className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-20 py-16 lg:py-24 gap-12 bg-white">
      {/* Texte */}
      <div className="flex-1 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
          <span className="text-red-600">
            Intégration de solutions informatiques, vente de logiciels et de matériels
          </span>
          <br />
          <br />
          Techniques et expertises informatique (TECHEXPERT),
        </h1>
        <p className="text-gray-600 mt-6 text-sm md:text-base">
          Se veut être une société de services en ingénierie informatique (SSII) ayant
          pour vocation l'intégration de solutions informatiques de très haut niveau.
        </p>
        <a href="#services">
          <button className="mt-6 bg-black text-white px-6 py-3 rounded-full hover:opacity-90 transition">
            En savoir plus
          </button>
        </a>
      </div>

      {/* Image */}
      <div className="flex-1 max-w-xl">
        <img
          src={hero}
          alt="Illustration"
          className="w-full h-auto object-contain rounded-xl"
        />
      </div>
    </main>
  );
};

export default Hero;
