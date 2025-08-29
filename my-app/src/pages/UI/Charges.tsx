import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import logo from "../../assets/logos/TE.png";

interface TechnicienStat {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  nb_tickets: number;
  temps_moyen: number; // en secondes
}

const Charges: React.FC = () => {
  const [stats, setStats] = useState<TechnicienStat[]>([]);
  const [periode, setPeriode] = useState<"jour" | "mois">("jour");

  useEffect(() => {
    axios
      .get(`/api/charges-techniciens/?periode=${periode}`)
      .then((res) => setStats(res.data))
      .catch(() => console.error("Erreur chargement des stats techniciens"));
  }, [periode]);

  const formatTemps = (seconds: number | null) => {
    if (!seconds || seconds <= 0) return "0m 0s";
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return `${min}m ${sec}s`;
  };

  const meilleurTech = stats.reduce((best, current) => {
    if (!best || current.nb_tickets > best.nb_tickets) return current;
    return best;
  }, null as TechnicienStat | null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50 print:bg-white print:p-8 print:text-black print:!m-0 print:!p-0">
      {/* Impression : logo et titre */}
      <div className="hidden print:block mb-6 text-center">
        <img src={logo} alt="Logo TECHEXPERT" className="h-20 mx-auto mb-2" />
        <h2 className="text-lg font-semibold uppercase">TECHEXPERT TICKETING</h2>
        <hr className="mt-2 border-red-500" />
      </div>

      {/* Titre + bouton (non imprimés) */}
      <div className="flex items-center justify-between print:hidden mb-4">
        <h1 className="text-2xl font-bold">📊 Charges des Techniciens</h1>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          🖨️ Imprimer
        </button>
      </div>

      {/* Filtres (non imprimés) */}
      <div className="mb-4 print:hidden">
        <label className="bg-white text-black px-3 py-1 rounded text-sm font-medium border border-gray-300 shadow-sm">
          Filtrer par :
        </label>
        <select
          value={periode}
          onChange={(e) => setPeriode(e.target.value as "jour" | "mois")}
          className="ml-2 border px-3 py-1 rounded text-sm shadow-sm bg-white text-black"
        >
          <option value="jour">Jour</option>
          <option value="mois">Mois</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto border rounded shadow-sm print:overflow-visible print:border-none">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-left text-gray-700 uppercase text-xs print:bg-white print:border-b">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Tickets clos</th>
              <th className="px-4 py-3">Temps moyen</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 print:divide-gray-300">
            {stats.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500 italic">
                  Aucune donnée disponible
                </td>
              </tr>
            ) : (
              stats.map((tech) => (
                <tr
                  key={tech.id}
                  className={`hover:bg-gray-50 ${
                    tech.id === meilleurTech?.id ? "bg-green-50 font-semibold" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    {tech.prenom} {tech.nom}
                    {tech.id === meilleurTech?.id && (
                      <span className="ml-2 inline-block bg-green-600 text-white text-xs px-2 py-0.5 rounded-full print:hidden">
                        ⭐ Meilleur
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-blue-600">{tech.email}</td>
                  <td className="px-4 py-3">{tech.nb_tickets}</td>
                  <td className="px-4 py-3">{formatTemps(tech.temps_moyen)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Charges;
