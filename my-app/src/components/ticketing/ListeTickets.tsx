import React, { useEffect, useState } from "react";
import axios from "../../api/axios";


interface Client {
  nom: string;
  type: "PROJET" | "SOCIETE";
}

interface Logiciel {
  id: number;
  nom: string;
}

interface Fichier {
  id: number;
  fichier: string; // URL du fichier
  date_ajout: string;
}

interface Ticket {
  id: number;
  logiciel: Logiciel;
  description: string;
  statut: "en_attente" | "en_cours" | "clos";
  date_creation: string;
  lien: {
    client: Client;
  };
  fichiers: Fichier[];
}

const ListeTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    axios
      .get("/api/mes-tickets/")
      .then((res) => setTickets(res.data))
      .catch((err) => console.error("Erreur chargement tickets:", err));
  }, []);

  const renderTicketsByStatus = (
    status: Ticket["statut"],
    label: string,
    color: string
  ) => {
    const filtered = tickets.filter((t) => t.statut === status);
    return (
      <section className="mb-8">
        <h3 className={`text-xl font-semibold mb-3 text-${color}-600`}>
          {label} ({filtered.length})
        </h3>
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Aucun ticket {label.toLowerCase()}.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map((ticket) => (
              <li key={ticket.id} className="py-4">
                <div className="flex flex-col gap-2">
                  <span className="text-base font-semibold text-gray-800">
                    {ticket.logiciel.nom} — {ticket.lien.client.nom} ({ticket.lien.client.type})
                  </span>

                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    📄 <strong>Description :</strong><br />
                    {ticket.description}
                  </p>

                  <div className="text-sm text-gray-600 mt-1">
                    <span className="text-xs text-gray-400">
                      Créé le : {new Date(ticket.date_creation).toLocaleDateString()}
                    </span>
                  </div>

                  {ticket.fichiers && ticket.fichiers.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">📎 Fichiers liés :</p>
                      <ul className="list-disc list-inside text-sm text-blue-600">
                        {ticket.fichiers.map((fichier) => (
                          <li key={fichier.id}>
                            <a
                              href={fichier.fichier}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {fichier.fichier.split("/").pop()}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  };

  return (
    <main className="flex-1 p-8 overflow-auto bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🎫 Mes Tickets</h2>
        {renderTicketsByStatus("en_attente", "En attente", "orange")}
        {renderTicketsByStatus("en_cours", "En cours", "blue")}
        {renderTicketsByStatus("clos", "Clôturés", "green")}
      </div>
    </main>
  );
};

export default ListeTickets;
