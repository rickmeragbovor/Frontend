import React, { useEffect, useState } from "react";
import axios from "../../api/axios";


interface Logiciel {
  nom: string;
}

interface Client {
  nom: string;
  type: "PROJET" | "SOCIETE";
}

interface Ticket {
  id: number;
  logiciel: Logiciel;
  lien: {
    client: Client;
  };
}

interface Fichier {
  id: number;
  fichier: string;
  date_ajout: string;
  ticket: Ticket;
}

const Files: React.FC = () => {
  const [fichiers, setFichiers] = useState<Fichier[]>([]);

  useEffect(() => {
    axios
      .get("/api/fichiers/")
      .then((res) => setFichiers(res.data))
      .catch((err) =>
        console.error("Erreur lors du chargement des fichiers :", err)
      );
  }, []);

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📁 Gestion des fichiers</h1>

      {fichiers.length === 0 ? (
        <p className="text-gray-600">Aucun fichier trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {fichiers.map((file) => (
            <li key={file.id} className="bg-white p-4 rounded shadow-sm border border-gray-200">
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-gray-800 font-medium">
                  🎫 Ticket #{file.ticket.id} — {file.ticket.logiciel.nom} / {file.ticket.lien.client.nom} ({file.ticket.lien.client.type})
                </span>
                <a
                  href={file.fichier}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📄 {file.fichier.split("/").pop()}
                </a>
                <span className="text-xs text-gray-500">
                  📅 Ajouté le : {new Date(file.date_ajout).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Files;
