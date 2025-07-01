import { useState } from "react";
import axios from "../api/axios";

interface AjoutRapportProps {
  ticketId: number;
  onClose: () => void;
}

const AjoutRapport = ({ ticketId, onClose }: AjoutRapportProps) => {
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!contenu.trim()) {
      alert("Veuillez saisir un contenu pour le rapport.");
      return;
    }
    try {
      setLoading(true);
      await axios.post("/rapports/", {
        ticket: ticketId,
        contenu,
      });
      alert("Rapport ajouté avec succès !");
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du rapport :", error);
      alert("Erreur lors de l'ajout du rapport.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Ajouter un rapport</h2>
        <textarea
          rows={6}
          className="w-full p-2 border rounded resize-none"
          placeholder="Saisissez le contenu du rapport..."
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? "Envoi..." : "Valider"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AjoutRapport;
