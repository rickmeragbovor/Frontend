import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios"; // adapte le chemin selon ton projet

const ConfirmationPage = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("⏳ Confirmation en cours...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setMessage("❌ Lien invalide ou token manquant.");
      setLoading(false);
      return;
    }

    // Appel backend pour confirmer la clôture
    axios
      .get(`/confirm-cloture/${token}/`)
      .then(() => {
        // Le backend fait une redirection, donc on peut considérer le succès si pas d'erreur
        // Mais ici on ne récupère pas le status dans l'URL car backend redirige normalement...
        setMessage("✅ Le ticket a été clôturé avec succès. Merci !");
      })
      .catch((error) => {
        if (error.response) {
          const status = error.response.status;
          if (status === 404) {
            setMessage("❌ Lien invalide ou ticket introuvable.");
          } else if (status === 400) {
            setMessage("⚠️ Ce ticket n’est pas en attente de confirmation.");
          } else {
            setMessage("❌ Une erreur technique est survenue.");
          }
        } else {
          setMessage("❌ Impossible de contacter le serveur.");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center max-w-md mx-4">
        <h1 className="text-2xl font-bold mb-4">Confirmation de Clôture</h1>
        <p className="text-gray-700">{loading ? "⏳ Confirmation en cours..." : message}</p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
