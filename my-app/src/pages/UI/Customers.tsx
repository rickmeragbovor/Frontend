import React, { useEffect, useState } from "react";
import axios from "../../api/axios";


interface Client {
  id: number;
  client: {
    nom: string;
    type: "PROJET" | "SOCIETE";
  };
}

const Customers: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("/api/personnel-clients/");
        setClients(response.data);
      } catch (err: any) {
        console.error("Erreur API :", err);
        setError("Erreur lors du chargement des clients liés.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Projets/Sociétés actifs</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border-b">Nom</th>
                <th className="p-2 border-b">Type</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((pc) => (
                <tr key={pc.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{pc.client.nom}</td>
                  <td className="p-2">{pc.client.type}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {clients.length === 0 && (
            <p className="text-center text-gray-500 mt-4">Aucun client lié trouvé.</p>
          )}
        </div>
      )}
    </main>
  );
};

export default Customers;
