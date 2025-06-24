import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import GestionTicket from "../components/GestionTicket";
import type { Ticket, User } from "../types";

const Dashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ticketActif, setTicketActif] = useState<Ticket | null>(null);
  const [timers, setTimers] = useState<Record<number, number>>({}); // temps écoulé par ticket id

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Chargement initial
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchData = async () => {
      try {
        const [ticketRes, userRes] = await Promise.all([
          axios.get<Ticket[]>("/tickets/"),
          axios.get<User>("/me/"),
        ]);
        // Normalisation
        const normalizedTickets = ticketRes.data.map((t) => ({
          ...t,
          societe:
            typeof t.societe === "string" ? { nom: t.societe } : t.societe,
          role: typeof t.role === "string" ? { nom: t.role } : t.role,
          description_type:
            typeof t.description_type === "string"
              ? { nom: t.description_type }
              : t.description_type,
        }));
        setTickets(normalizedTickets);
        setUser(userRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Gestion timer : incrémente le temps du ticket actif chaque seconde
  useEffect(() => {
    if (ticketActif) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimers((prev) => ({
          ...prev,
          [ticketActif.id]: (prev[ticketActif.id] ?? 0) + 1,
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [ticketActif]);

  const handleCloture = (ticketId: number) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, statut: "cloturé" } : t))
    );
    // Supprimer timer du ticket clôturé
    setTimers((prev) => {
      const copy = { ...prev };
      delete copy[ticketId];
      return copy;
    });
    setShowModal(false);
    setTicketActif(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const handleEscalader = (ticket: Ticket) => {
    alert(`Ticket ${ticket.id} escaladé !`);
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-red-600">
        Utilisateur non authentifié. Redirection en cours...
      </div>
    );
  }

  // Formatage du temps (secondes -> "Xm Ys")
  const formatTemps = (sec: number) =>
    `${Math.floor(sec / 60)}m ${sec % 60}s`;

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md flex flex-col">
        <div className="mb-8">
          <div className="font-bold text-lg">
            {user.prenom} {user.nom}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="text-xs text-gray-400 italic mt-1">Rôle: {user.role}</div>
        </div>

        <nav className="flex-1 space-y-3 text-sm text-gray-600">
          <div className="font-semibold text-red-500">Tableau de bord</div>
          {/* Boutons ici */}
          <button
            onClick={handleLogout}
            className="text-left text-red-600 hover:underline mt-4"
          >
            Déconnexion
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Bonjour, {user.prenom}!</h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Derniers tickets</h2>
          {tickets.length === 0 ? (
            <p className="text-center text-gray-500">Aucun ticket trouvé.</p>
          ) : (
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">N°</th>
                  <th className="p-3 border-b">Noms</th>
                  <th className="p-3 border-b">Prestations</th>
                  <th className="p-3 border-b">Statuts</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => {
                  const isAnotherTicketActive =
                    ticketActif !== null && ticketActif.id !== ticket.id;

                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{`TETK00${ticket.id}`}</td>
                      <td className="p-3 border-b">{ticket.nom}</td>
                      <td className="p-3 border-b">{ticket.prestation}</td>
                      <td className="p-3 border-b">
                        <span className="text-sm px-2 py-1 rounded-full bg-red-100 text-red-600">
                          {ticket.statut}
                        </span>
                      </td>
                      <td className="p-3 border-b flex space-x-4 items-center">
                        {ticket.statut === "cloturé" ? (
                          <button
                            className="text-sm px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed"
                            disabled
                          >
                            Clôturé
                          </button>
                        ) : (
                          <>
                            <button
                              className={`text-sm px-3 py-1 rounded text-white ${
                                isAnotherTicketActive
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                              onClick={() => {
                                if (!isAnotherTicketActive) {
                                  setTicketActif(ticket);
                                  setShowModal(true);
                                  setTimers((prev) => ({
                                    ...prev,
                                    [ticket.id]: prev[ticket.id] ?? 0,
                                  }));
                                }
                              }}
                              disabled={isAnotherTicketActive}
                            >
                              Gérer
                            </button>
                            {/* Affichage du temps écoulé sur le bouton si > 0 */}
                            {timers[ticket.id] > 0 && (
                              <span className="text-gray-700 text-sm">
                                {formatTemps(timers[ticket.id])}
                              </span>
                            )}
                          </>
                        )}
                        <button
                          className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          onClick={() => handleEscalader(ticket)}
                        >
                          Escalader
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modale gestion ticket */}
      {showModal && ticketActif && (
        <GestionTicket
          ticket={ticketActif}
          onClose={() => setShowModal(false)}
          onCloture={handleCloture}
          tempsEcoule={timers[ticketActif.id] ?? 0}
        />
      )}
    </div>
  );
};

export default Dashboard;
