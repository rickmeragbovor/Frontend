import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

type Role = "administrateur" | "superviseur" | "technicien" | "personnel";

interface User {
  id: number;
  nom: string;
  prenom: string;
  roles: { nom: Role }[];
  email: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    tickets: 0,
    utilisateurs: 0,
    techniciens: 0,
    logiciels: 0,
    rapports: 0,
    clients: 0,
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Charger l'utilisateur connecté depuis localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ticketsRes, usersRes, logicielsRes, rapportsRes, clientsRes] = await Promise.all([
          axios.get("/api/tickets/"),
          axios.get("/api/utilisateurs/"),
          axios.get("/api/logiciels/"),
          axios.get("/api/rapports/"),
          axios.get("/api/clients/"),
        ]);

        const utilisateurs = usersRes.data;
        const techniciens = utilisateurs.filter((u: any) =>
          u.roles.some((r: any) => r.nom === "technicien")
        );

        setStats({
          tickets: ticketsRes.data.length,
          utilisateurs: utilisateurs.length,
          techniciens: techniciens.length,
          logiciels: logicielsRes.data.length,
          rapports: rapportsRes.data.length,
          clients: clientsRes.data.length,
        });
      } catch (error) {
        console.error("Erreur chargement des statistiques :", error);
      }
    };

    fetchStats();
  }, []);

  if (!user) return null; // ou un loader...

  // On considère que l'utilisateur a au moins un rôle (le premier rôle principal)
  const role: Role = user.roles[0].nom;

  return (
    <main className="flex-1 p-6 bg-gray-100 overflow-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Statistiques générales</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Tickets" value={stats.tickets} />

        {/* Afficher ces stats uniquement si l'utilisateur est admin ou superviseur */}
        {(role === "administrateur" || role === "superviseur") && (
          <>
            <StatCard label="Utilisateurs" value={stats.utilisateurs} />
            <StatCard label="Techniciens" value={stats.techniciens} />
            <StatCard label="Clients" value={stats.clients} />
          </>
        )}

        <StatCard label="Logiciels" value={stats.logiciels} />

        {/* Rapports non visibles par le personnel */}
        {(role !== "personnel") && (
          <StatCard label="Rapports" value={stats.rapports} />
        )}
      </div>
    </main>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <p className="text-sm text-gray-600">{label}</p>
    <h3 className="text-2xl font-bold text-red-500">{value}</h3>
  </div>
);

export default Dashboard;
