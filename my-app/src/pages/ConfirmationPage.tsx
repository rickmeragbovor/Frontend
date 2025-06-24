import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("⏳ Confirmation en cours...");

  useEffect(() => {
    const status = searchParams.get("status");

    switch (status) {
      case "success":
        setMessage("✅ Le ticket a été clôturé avec succès. Merci !");
        break;
      case "invalid":
        setMessage("⚠️ Ce ticket n’est pas en attente de confirmation.");
        break;
      case "notfound":
        setMessage("❌ Lien invalide ou ticket introuvable.");
        break;
      case "error":
        setMessage("❌ Une erreur technique est survenue.");
        break;
      default:
        setMessage("❌ Statut inconnu ou lien invalide.");
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center max-w-md mx-4">
        <h1 className="text-2xl font-bold mb-4">Confirmation de Clôture</h1>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
