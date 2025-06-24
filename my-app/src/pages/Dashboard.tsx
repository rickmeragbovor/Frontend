import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import GestionTicket from "../components/GestionTicket";

interface Ticket {
  id: number;
  nom: string;
  prestation: string; // doit contenir le nom déjà (pas l'ID)
  statut: string;
  societe?: string;
  role?: string;
  telephone?: string;
  description?: string;
}

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role?: string; // ex: "admin" ou "technicien"
}

const Dashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ticketActif, setTicketActif] = useState<Ticket | null>(null);
  const navigate = useNavigate();

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
        setTickets(ticketRes.data);
        setUser(userRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCloture = (ticketId: number) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, statut: "cloturé" } : t))
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const handleEscalader = (ticket: Ticket) => {
    // TODO: Logique d'escalade, ici un simple alert
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

  const isAdmin =
    user.role === "admin" ||
    user.role === "administrateur" ||
    user.email.toLowerCase().includes("rickmer");
  const isTechnicien =
    user.role === "technicien" || user.email.toLowerCase().includes("kossivi");

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

          {isAdmin && (
            <>
              <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                Utilisateurs
              </button>
              <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                États
              </button>
              <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                Statistiques
              </button>
              <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                Tickets
              </button>
              <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                Historiques
              </button>
            </>
          )}

          {isTechnicien && (
            <>
              <div className="cursor-pointer hover:text-red-600">Tickets</div>
              <div className="cursor-pointer hover:text-red-600">Historiques</div>
            </>
          )}

          {!isAdmin && !isTechnicien && (
            <>
              <div className="cursor-pointer hover:text-red-600">Tickets</div>
            </>
          )}

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Hey, {user.prenom}!</h1>
          {isAdmin && (
            <p className="text-red-600 font-semibold">
              Vous êtes connecté en tant qu'administrateur
            </p>
          )}
          {isTechnicien && (
            <p className="text-red-600 font-semibold">
              Vous êtes connecté en tant que technicien
            </p>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="text-sm font-semibold mb-1">Solde</h2>
            <p className="text-3xl font-bold text-red-600">$19,453.43</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="text-sm font-semibold mb-1">Tickets</h2>
            <p className="text-2xl font-bold text-red-600">{tickets.length}</p>
          </div>

          {isAdmin && (
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h2 className="text-sm font-semibold mb-1">Utilisateurs</h2>
              <p className="text-2xl font-bold text-red-600">--</p>
            </div>
          )}
        </div>

        {/* Table Tickets */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Derniers tickets</h2>
          {tickets.length === 0 ? (
            <p className="text-center text-gray-500">Aucun ticket trouvé.</p>
          ) : (
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Nom</th>
                  <th className="p-3 border-b">Prestation</th>
                  <th className="p-3 border-b">Statut</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{`TETK00${ticket.id}`}</td>
                    <td className="p-3 border-b">{ticket.nom}</td>
                    <td className="p-3 border-b">{ticket.prestation}</td>
                    <td className="p-3 border-b">
                      <span className="text-sm px-2 py-1 rounded-full bg-red-100 text-red-600">
                        {ticket.statut}
                      </span>
                    </td>
                    <td className="p-3 border-b flex space-x-2">
                      {/* Bouton Gérer (désactivé si clôturé) */}
                      {ticket.statut === "cloturé" ? (
                        <button
                          className="text-sm px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed"
                          disabled
                        >
                          Clôturé
                        </button>
                      ) : (
                        <button
                          className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => {
                            setTicketActif(ticket);
                            setShowModal(true);
                          }}
                        >
                          Gérer
                        </button>
                      )}

                      {/* Bouton Escalader (toujours actif) */}
                      <button
                        className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => handleEscalader(ticket)}
                      >
                        Escalader
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MODALE de gestion */}
      {showModal && ticketActif && (
        <GestionTicket
          ticket={ticketActif}
          onClose={() => setShowModal(false)}
          onCloture={handleCloture}
        />
      )}
    </div>
  );
};

export default Dashboard;
