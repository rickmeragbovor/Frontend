import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

const ConfirmationPage = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("⏳ Confirmation en cours...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmerCloture = async () => {
      try {
        // Appelle GET sur /api/confirm-cloture/<token>/
        await axios.get(`/api/confirm-cloture/${token}/`);
        setMessage("✅ Le ticket a été clôturé avec succès.");
      } catch (error: any) {
        if (error.response?.status === 404) {
          setMessage("❌ Lien invalide ou ticket introuvable.");
        } else if (error.response?.status === 400) {
          setMessage("⚠️ Ce ticket n’est pas en attente de confirmation.");
        } else {
          setMessage("❌ Une erreur est survenue.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      confirmerCloture();
    } else {
      setMessage("❌ Token manquant.");
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center max-w-md mx-4">
        <h1 className="text-2xl font-bold mb-4">Confirmation de Clôture</h1>
        <p className="text-gray-700">{message}</p>
        {loading && <p className="text-gray-500 mt-4">Merci de patienter...</p>}
      </div>
    </div>
  );
};

export default ConfirmationPage;
