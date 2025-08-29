import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

interface Fichier {
  id: number;
  fichier: string; // url du fichier
  date_ajout: string;
}

interface Ticket {
  id: number;
  statut: string;
  temps_traitement?: string;
  date_cloture: string;
  lien: {
    client: {
      nom: string;
    };
  };
  fichiers?: Fichier[];
}

const HistoriqueTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTicketIds, setOpenTicketIds] = useState<Set<number>>(new Set());
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("/api/mes-tickets-clos/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des tickets :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  const toggleFiles = (id: number) => {
    setOpenTicketIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">📁 Historique de mes tickets clôturés</h1>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500">Aucun ticket clôturé trouvé.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-left text-sm text-gray-600">
              <tr>
                <th className="p-3">Client</th>
                <th className="p-3">Temps de traitement</th>
                <th className="p-3">Date de clôture</th>
                <th className="p-3 text-center">Fichiers</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <React.Fragment key={ticket.id}>
                  <tr
                    className="border-t text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleFiles(ticket.id)}
                  >
                    <td className="p-3">{ticket.lien.client.nom}</td>
                    <td className="p-3">{ticket.temps_traitement || "—"}</td>
                    <td className="p-3">
                      {ticket.date_cloture
                        ? new Date(ticket.date_cloture).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-3 text-center text-blue-600 underline">
                      {ticket.fichiers && ticket.fichiers.length > 0
                        ? openTicketIds.has(ticket.id)
                          ? "▼ Cacher"
                          : `📂 ${ticket.fichiers.length} fichier(s)`
                        : "—"}
                    </td>
                  </tr>

                  {openTicketIds.has(ticket.id) && ticket.fichiers && ticket.fichiers.length > 0 && (
                    <tr>
                      <td colSpan={4} className="bg-gray-50 px-6 py-4 text-center">
                        <ul className="inline-block text-sm space-y-1 text-left">
                          {ticket.fichiers.map((f) => (
                            <li key={f.id}>
                              <a
                                href={f.fichier}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                Fichier #{f.id} (ajouté le {new Date(f.date_ajout).toLocaleDateString()})
                              </a>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoriqueTickets;
