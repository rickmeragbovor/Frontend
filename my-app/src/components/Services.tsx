import { Lightbulb, Laptop, Settings, BookOpen, ShoppingCart } from "lucide-react";

const services = [
  {
    icon: <Settings className="text-red-600 w-8 h-8 mb-4" />,
    title: "Maintenance informatique",
    description: "Assurez la continuité de vos opérations avec notre service de maintenance complet.",
  },
  {
    icon: <Laptop className="text-red-600 w-8 h-8 mb-4" />,
    title: "Développement de logiciels",
    description: "Créez des logiciels sur mesure pour votre entreprise avec nos développeurs experts.",
  },
  {
    icon: <Lightbulb className="text-red-600 w-8 h-8 mb-4" />,
    title: "Conseils & assistance technique",
    description: "Profitez de l'expertise des techexperts pour prendre vos décisions techniques stratégiques.",
  },
  {
    icon: <Settings className="text-red-600 w-8 h-8 mb-4" />,
    title: "Systèmes informatisés de gestion",
    description: "Mise en place de solutions certifiées TOMATE pour une gestion efficace.",
  },
  {
    icon: <BookOpen className="text-red-600 w-8 h-8 mb-4" />,
    title: "Formations qualifiantes & certifiantes",
    description: "Renforcez les compétences de vos équipes avec nos formations professionnelles certifiées.",
  },
  {
    icon: <ShoppingCart className="text-red-600 w-8 h-8 mb-4" />,
    title: "Vente de matériels & consommables",
    description: "Fourniture de matériel informatique fiable, adapté à vos besoins et votre budget.",
  },
];

const Services = () => {
  return (
    <section className="bg-white py-20 px-6 lg:px-20" id="services">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-14">
        Nos services
      </h2>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl border border-transparent hover:border-red-600 transition-transform duration-300 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-start">
              {service.icon}
              <h3 className="text-lg font-semibold text-red-700 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-700 text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
