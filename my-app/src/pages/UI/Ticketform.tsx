import React, { useEffect, useState } from "react";
import axios from "../../api/axios";


interface TypeProbleme {
  id: number;
  nom: string;
}

interface Logiciel {
  id: number;
  nom: string;
  type_problemes: TypeProbleme[];
}

interface Client {
  nom: string;
  type: "PROJET" | "SOCIETE";
}

interface PersonnelClient {
  id: number; // id du lien PersonnelClient
  client: Client;
}

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  roles: { nom: string }[];
}

const TicketForm: React.FC = () => {
  const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
  const [clients, setClients] = useState<PersonnelClient[]>([]);
  const [lienId, setLienId] = useState<number | null>(null);
  const [selectedLogicielId, setSelectedLogicielId] = useState<number | null>(null);
  const [typeProblemeId, setTypeProblemeId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [fichiers, setFichiers] = useState<FileList | null>(null);

  const user: User = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get("/api/personnel-clients/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Erreur clients liés :", err));
  }, [user]);

  useEffect(() => {
    axios
      .get("/api/logiciels/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setLogiciels(res.data))
      .catch((err) => console.error("Erreur logiciels :", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lienId || !selectedLogicielId || !typeProblemeId || !description.trim()) {
      alert("Veuillez remplir tous les champs requis.");
      return;
    }

    const formData = new FormData();
    formData.append("lien", String(lienId)); // FK vers PersonnelClient
    formData.append("logiciel", String(selectedLogicielId)); // FK vers Logiciel
    formData.append("type_probleme", String(typeProblemeId)); // champ additionnel à gérer côté backend
    formData.append("description", description);

    if (fichiers) {
      Array.from(fichiers).forEach((file) => {
        formData.append("fichiers", file);
      });
    }

    try {
      await axios.post("/api/tickets/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Ticket envoyé avec succès !");
      setLienId(null);
      setSelectedLogicielId(null);
      setTypeProblemeId(null);
      setDescription("");
      setFichiers(null);
    } catch (error) {
      console.error("Erreur envoi ticket :", error);
      alert("❌ Erreur lors de la création du ticket.");
    }
  };

  return (
    <main className="flex-1 p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">🎫 Créer un ticket</h1>

 <form
  onSubmit={handleSubmit}
  className="space-y-6 bg-white px-4 py-6 sm:px-6 md:px-8 lg:px-10 rounded-2xl shadow-xl w-full max-w-xl mx-auto border border-gray-200"
>


        {/* Client concerné */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Client concerné <span className="text-red-500">*</span>
          </label>
          <select
            value={lienId ?? ""}
            onChange={(e) => setLienId(Number(e.target.value))}
            className="w-full bg-white text-black border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">-- Sélectionner un client --</option>
            {clients.map((pc) => (
              <option key={pc.id} value={pc.id}>
                {pc.client.nom} ({pc.client.type})
              </option>
            ))}
          </select>
        </div>

        {/* Logiciel concerné */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Logiciel concerné <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedLogicielId ?? ""}
            onChange={(e) => setSelectedLogicielId(Number(e.target.value))}
            className="w-full bg-white text-black border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">-- Sélectionner --</option>
            {logiciels.map((logiciel) => (
              <option key={logiciel.id} value={logiciel.id}>
                {logiciel.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Type de problème */}
        {selectedLogicielId && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Type de problème <span className="text-red-500">*</span>
            </label>
            <select
              value={typeProblemeId ?? ""}
              onChange={(e) => setTypeProblemeId(Number(e.target.value))}
              className="w-full bg-white text-black border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">-- Sélectionner --</option>
              {logiciels
                .find((l) => l.id === selectedLogicielId)
                ?.type_problemes.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.nom}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Description du problème <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full bg-white text-black border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        {/* Fichiers joints */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Fichiers joints (facultatif)
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => setFichiers(e.target.files)}
            className="w-full text-sm text-black bg-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
        </div>

        {/* Bouton Submit */}
        <div className="text-right pt-4">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow transition duration-150"
          >
            ✅ Envoyer le ticket
          </button>
        </div>
      </form>
    </main>
  );
};

export default TicketForm;
