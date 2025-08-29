import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import PersonnelDashboard from "./PersonnelDashboard";


type Role = "administrateur" | "superviseur" | "technicien" | "personnel";

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  roles: { nom: Role }[];
}

interface Stats {
  tickets: number;
  logiciels: number;
  utilisateurs: number;
  techniciens: number;
  rapports: number;
  clients: number;
  rapportsTraites?: number;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({
    tickets: 0,
    logiciels: 0,
    utilisateurs: 0,
    techniciens: 0,
    rapports: 0,
    clients: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        const role = user.roles[0].nom;

        if (role === "technicien") {
          // Stats pour technicien
          const { data } = await axios.get("/api/stats/technicien/");
          setStats({
            tickets: data.tickets_traite,
            logiciels: data.logiciels_utilises.length,
            rapports: data.nombre_rapports,
            utilisateurs: 0,
            techniciens: 0,
            clients: 0,
            rapportsTraites: data.nombre_rapports,
          });
        } else if (role === "administrateur" || role === "superviseur") {
          // Stats pour admins et superviseurs
          const [
            { data: tickets },
            { data: users },
            { data: logiciels },
            { data: rapports },
            { data: clients },
          ] = await Promise.all([
            axios.get("/api/tickets/"),
            axios.get("/api/utilisateurs/"),
            axios.get("/api/logiciels/"),
            axios.get("/api/rapports/"),
            axios.get("/api/clients/"),
          ]);

          const techniciens = users.filter((u: any) =>
            u.roles.some((r: any) => r.nom === "technicien")
          );

          setStats({
            tickets: tickets.length,
            logiciels: logiciels.length,
            utilisateurs: users.length,
            techniciens: techniciens.length,
            rapports: rapports.length,
            clients: clients.length,
          });
        }
        // On ne charge pas les stats pour le personnel ici
      } catch (error) {
        console.error("Erreur chargement des statistiques :", error);
      }
    };

    loadStats();
  }, [user]);

  if (!user) return null;

  const role: Role = user.roles[0].nom;
  const isAdmin = role === "administrateur" || role === "superviseur";

  // Rendu pour le personnel : on appelle un composant dédié
  if (role === "personnel") {
    return <PersonnelDashboard />;
  }

  // Rendu pour admins et techniciens
  return (
    <main className="flex-1 p-6 bg-gray-100 overflow-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Statistiques</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Tickets clos" value={stats.tickets} />
        <StatCard label="Logiciels" value={stats.logiciels} />

        {isAdmin && (
          <>
            <StatCard label="Utilisateurs" value={stats.utilisateurs} />
            <StatCard label="Techniciens" value={stats.techniciens} />
            <StatCard label="Clients" value={stats.clients} />
            <StatCard label="Rapports (total)" value={stats.rapports} />
          </>
        )}

        {role === "technicien" && (
          <StatCard label="Rapports" value={stats.rapportsTraites || 0} />
        )}
      </div>
    </main>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <p className="text-sm text-gray-600">{label}</p>
    <h3 className="text-2xl font-bold text-rose-600">{value}</h3>
  </div>
);

export default Dashboard;
