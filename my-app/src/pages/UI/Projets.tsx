import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import logo from "../../assets/logos/TE.png"; // Logo pour l'impression

interface Client {
  id: number;
  nom: string;
  type: "PROJET" | "SOCIETE";
}

const Projets: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get<Client[]>("/api/clients/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClients(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des clients :", err);
        setError("Impossible de charger les projets.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50 print:bg-white print:p-8 print:text-black">
      {/* En-tête pour impression */}
      <div className="hidden print:block mb-6 text-center">
        <img src={logo} alt="Logo TECHEXPERT" className="h-20 mx-auto mb-2" />
        <h2 className="text-lg font-semibold uppercase">Liste des Projets / Clients</h2>
        <hr className="mt-2 border-red-500" />
      </div>

      {/* Titre + bouton impression */}
      <div className="flex items-center justify-between print:hidden mb-4">
        <h1 className="text-2xl font-bold">📋 Projets enregistrés</h1>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          🖨️ Imprimer
        </button>
      </div>

      {/* Contenu principal */}
      <div className="bg-white p-6 rounded-xl shadow print:shadow-none print:p-0">
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : clients.length === 0 ? (
          <p className="text-gray-500">Aucun projet trouvé.</p>
        ) : (
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-100 text-left text-gray-700 uppercase text-xs print:bg-white print:border-b">
              <tr>
                <th className="p-2 border-b">Nom</th>
                <th className="p-2 border-b">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 print:divide-gray-300">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="p-2">{client.nom}</td>
                  <td className="p-2">{client.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default Projets;
