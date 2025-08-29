import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "../../api/axios";

interface Statistique {
  periode: string;
  nb_tickets: number;
  temps_moyen_minutes: number;
}

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  roles: { id: number; nom: string }[];
}

interface Technicien {
  id: number;
  nom_complet: string;
}

const Techperfs: React.FC = () => {
  const [techniciens, setTechniciens] = useState<Technicien[]>([]);
  const [selectedTechId, setSelectedTechId] = useState<number | null>(null);
  const [data, setData] = useState<Statistique[]>([]);
  const [periode, setPeriode] = useState<"jour" | "mois">("jour");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  // Charger les techniciens
  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        const res = await axios.get<Utilisateur[]>("/api/utilisateurs/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const techs = res.data
          .filter((user) =>
            user.roles.some((role) => role.nom.toLowerCase() === "technicien")
          )
          .map((tech) => ({
            id: tech.id,
            nom_complet: `${tech.prenom} ${tech.nom}`,
          }));

        setTechniciens(techs);
        setSelectedTechId(techs.length > 0 ? techs[0].id : null);

        if (techs.length === 0) {
          setError("Aucun technicien trouvé.");
        }
      } catch (err) {
        console.error("Erreur chargement utilisateurs:", err);
        setError("Impossible de charger la liste des utilisateurs.");
      }
    };
    fetchTechniciens();
  }, [token]);

  // Charger les statistiques
  useEffect(() => {
    if (selectedTechId === null) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<Statistique[]>(
          `/api/statistiques/?periode=${periode}&technicien_id=${selectedTechId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ⚡ Assurer que les valeurs sont bien des nombres
        const cleanData = res.data.map((d) => ({
          periode: d.periode,
          nb_tickets: Number(d.nb_tickets),
          temps_moyen_minutes: Number(d.temps_moyen_minutes),
        }));

        setData(cleanData);
      } catch (err) {
        console.error("Erreur chargement statistiques:", err);
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTechId, periode, token]);

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">📈 Performances par Technicien</h1>

      {/* Sélecteurs */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="mr-2 font-medium text-gray-700">Technicien :</label>
          <select
            value={selectedTechId?.toString() ?? ""}
            onChange={(e) => setSelectedTechId(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {techniciens.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.nom_complet}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium text-gray-700">Vue :</label>
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value as "jour" | "mois")}
            className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="jour">Journalier</option>
            <option value="mois">Mensuel</option>
          </select>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

      {/* Loading */}
      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <div className="bg-white rounded shadow p-4">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periode" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Tickets",
                  angle: -90,
                  position: "insideLeft",
                }}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Temps moyen (min)",
                  angle: 90,
                  position: "insideRight",
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name === "Temps moyen"
                    ? [`${value} min`, name]
                    : [value, name]
                }
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="nb_tickets"
                stroke="#8884d8"
                name="Tickets clos"
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="temps_moyen_minutes"
                stroke="#82ca9d"
                name="Temps moyen"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </main>
  );
};

export default Techperfs;
