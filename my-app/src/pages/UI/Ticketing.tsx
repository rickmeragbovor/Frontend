// src/pages/Ticketing.tsx
import React, { useState } from "react";
import ListeTickets from "../../components/ticketing/ListeTickets";
import TraitementTicket from "../../components/ticketing/TraitementTicket";
import HistoriqueTickets from "../../components/ticketing/HistoriqueTickets";


const Ticketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tickets" | "traitement" | "historique">("tickets");
  const renderTabContent = () => {
    switch (activeTab) {
      case "tickets":
        return <ListeTickets />;
      case "traitement":
        return <TraitementTicket />;
      case "historique":
        return <HistoriqueTickets />;
        
    }
  };

  return (
   

   
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Gestion des Tickets</h1>

        {/* Onglets */}
        <div className="mb-4 flex space-x-4 border-b border-gray-300">
          <TabButton label="Tickets" value="tickets" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton label="Traitement" value="traitement" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton label="Historique" value="historique" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Contenu selon l'onglet */}
        <div className="bg-white p-6 rounded-xl shadow">
          {renderTabContent()}
        </div>
      </main>
  
  );
};

export default Ticketing;

// Composant bouton d'onglet réutilisable
type TabProps = {
  label: string;
  value: "tickets" | "traitement" | "historique" | "logiciels";
  activeTab: string;
  setActiveTab: (tab: any) => void;
};

const TabButton: React.FC<TabProps> = ({ label, value, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-4 py-2 font-medium transition-all ${
      activeTab === value
        ? "border-b-2 border-red-600 text-red-600"
        : "text-gray-600 hover:text-red-500"
    }`}
  >
    {label}
  </button>
);
