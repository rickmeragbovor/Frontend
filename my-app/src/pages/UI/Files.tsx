import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

interface Logiciel {
  nom: string;
}

interface Client {
  nom: string;
  type: "PROJET" | "SOCIETE";
}

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
}

interface Lien {
  client: Client;
  personnel: Personnel;
}

interface Ticket {
  id: number;
  logiciel: Logiciel;
  lien: Lien;
}

interface Fichier {
  id: number;
  fichier: string;
  date_ajout: string;
  ticket: Ticket;
}

const Files: React.FC = () => {
  const [fichiers, setFichiers] = useState<Fichier[]>([]);
  const [filteredFichiers, setFilteredFichiers] = useState<Fichier[]>([]);
  const [search, setSearch] = useState("");
  const [utilisateurId, setUtilisateurId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/me/")
      .then((res) => setUtilisateurId(res.data.id))
      .catch((err) =>
        console.error("Erreur lors de la récupération de l'utilisateur :", err)
      );
  }, []);

  useEffect(() => {
    if (utilisateurId === null) return;

    axios
      .get<Fichier[]>("/api/fichiers/")
      .then((res) => {
        const fichiersPerso = res.data.filter(
          (f) => f.ticket.lien?.personnel?.id === utilisateurId
        );
        setFichiers(fichiersPerso);
        setFilteredFichiers(fichiersPerso);
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des fichiers :", err)
      )
      .finally(() => setLoading(false));
  }, [utilisateurId]);

  // 🔍 Filtrage local
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = fichiers.filter((f) =>
      f.ticket.logiciel.nom.toLowerCase().includes(lowerSearch) ||
      f.ticket.lien.client.nom.toLowerCase().includes(lowerSearch) ||
      f.fichier.toLowerCase().includes(lowerSearch)
    );
    setFilteredFichiers(filtered);
  }, [search, fichiers]);

  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📁 Mes Fichiers liés aux tickets
      </h1>

      {/* 🔍 Barre de recherche */}
     <div className="mb-4 max-w-md">
  <input
    type="text"
    placeholder="Rechercher par client, logiciel ou nom de fichier..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-rose-200 text-sm bg-white text-black placeholder-gray-500"
  />
</div>


      {loading ? (
        <p className="text-rose-600 animate-pulse">Chargement des fichiers...</p>
      ) : filteredFichiers.length === 0 ? (
        <p className="text-gray-600">Aucun fichier trouvé pour cette recherche.</p>
      ) : (
        <div className="overflow-x-auto border rounded shadow-sm bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-rose-100 text-rose-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Logiciel</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Type client</th>
                <th className="px-4 py-3">Fichier</th>
                <th className="px-4 py-3">Date d'ajout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFichiers.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 font-medium text-gray-700">
                    #{file.ticket.id}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {file.ticket.logiciel.nom}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {file.ticket.lien.client.nom}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {file.ticket.lien.client.type}
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={file.fichier}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 hover:underline"
                    >
                      {file.fichier.split("/").pop()}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-xs">
                    {new Date(file.date_ajout).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default Files;
