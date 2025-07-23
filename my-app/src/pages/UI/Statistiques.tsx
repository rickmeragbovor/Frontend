// src/pages/Ticketing.tsx
import React from "react";
import { useNavigate } from "react-router-dom";



const Statistiques: React.FC = () => {
  const navigate = useNavigate();
  return (
      <main className="flex-1 p-8 overflow-auto bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Gestion des Statistiques </h1>

        <div className="bg-white p-6 rounded-xl shadow">
          {/* Contenu spécifique à la gestion des tickets */}
          <p className="text-gray-600">Ici s'affichera la liste ou le formulaire des tickets.</p>
        </div>
      </main>
  
  );
};

export default Statistiques;
