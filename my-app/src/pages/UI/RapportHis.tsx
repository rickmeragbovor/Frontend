import { useEffect, useState } from "react";
import axios from "../../api/axios";

// === Définition du type Rapport ===
interface Rapport {
  id: number;
  ticket: number;
  date: string;
  fichier: string;
}

// === Composant RapportHis ===
const RapportHis = () => {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [loading, setLoading] = useState(true);

  // === Récupération des rapports depuis l'API ===
  useEffect(() => {
    axios
      .get<Rapport[]>("http://127.0.0.1:8000/api/rapports/") // adapte si nécessaire
      .then((res) => setRapports(res.data))
      .catch((err) => console.error("Erreur lors du chargement des rapports :", err))
      .finally(() => setLoading(false));
  }, []);

  // === Formatage de la date ===
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // === Rendu ===
  if (loading) return <p>Chargement des rapports...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Historique des Rapports</h2>
      {rapports.length === 0 ? (
        <p>Aucun rapport disponible.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">Ticket</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Fichier</th>
            </tr>
          </thead>
          <tbody>
            {rapports.map((rapport) => (
              <tr key={rapport.id} className="hover:bg-gray-50">
                <td className="border p-2">{rapport.id}</td>
                <td className="border p-2">Ticket #{rapport.ticket}</td>
                <td className="border p-2">{formatDate(rapport.date)}</td>
                <td className="border p-2">
                  <a
                    href={rapport.fichier}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Télécharger
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RapportHis;
