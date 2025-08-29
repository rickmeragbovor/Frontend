import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "../lib/utils";
import type { User } from "../types";
import {
  ChevronDown,
  HomeIcon,
  Users,
  UserPlus,
  Building2,
  Box,
  Boxes,
  AlertCircle,
  Ticket,
  ClipboardList,
  FileText,
  File,
  BarChart2,
  CheckCircle,
  PenBox,
  FolderOpen,
  History,
  LineChart,
  PlusSquare,
} from "lucide-react";

type Role = "administrateur" | "technicien" | "superviseur" | "personnel";

interface SectionItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
}

interface Section {
  key: string;
  title: string;
  icon: React.ReactNode;
  items?: SectionItem[];
  to?: string;
}

const sidebarSections: Record<Role, Section[]> = {
  administrateur: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: <HomeIcon className="w-4 h-4" />,
      to: "/dashboard",
    },
    {
      key: "users",
      title: "Utilisateurs",
      icon: <Users size={16} />,
      to: "/dashboard/users",
    },
    {
      key: "clients",
      title: "Clients",
      icon: <Building2 size={16} />,
       items: [
        { label: "Projets actifs", icon: <Box size={16} />, to: "/dashboard/customers" },
        { label: "Liste des projets  ", icon: <Boxes size={16} />, to: "/dashboard/projets" },
        { label: "Statistiques", icon: <AlertCircle size={16} />, to: "/dashboard/projets-statistiques" },
      ],
     
    },
    {
      key: "logiciels",
      title: "Logiciels",
      icon: <Boxes size={16} />,
      items: [
        { label: "Logiciels", icon: <Box size={16} />, to: "/dashboard/logiciels" },
        { label: "Types de problèmes", icon: <AlertCircle size={16} />, to: "/dashboard/types-problemes" },
      ],
    },
    {
      key: "tickets",
      title: "Tickets",
      icon: <Ticket size={16} />,
      to: "/dashboard/ticketing",
    },
    {
      key: "stats",
      title: "Etats & Statistiques",
      icon: <BarChart2 size={16} />,
      items: [
        { label: "Rapports", icon: <FileText size={16} />, to: "/dashboard/rapports" },
        { label: "Suivi charge", icon: <BarChart2 size={16} />, to: "/dashboard/techniciens/charge" },
        {label: "Performances", icon: <LineChart size={16} />, to: "/dashboard/techniciens/techperf"}
      ],
    },
  ],

  technicien: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: <HomeIcon className="w-4 h-4" />,
      to: "/dashboard",
    },
    {
      key: "mes_tickets",
      title: "Mes Tickets",
      icon: <Ticket size={16} />,
      items: [
        { label: "À traiter", icon: <ClipboardList size={16} />, to: "/dashboard/tickets/a-traiter" },
        { label: "Clôturés", icon: <CheckCircle size={16} />, to: "/dashboard/tickets/clotures" },
      ],
    },
    {
      key: "rapports",
      title: "Rapports",
      icon: <FileText size={16} />,
      items: [
        { label: "Ajouter", icon: <PenBox size={16} />, to: "/dashboard/rapports/ajouter" },
        { label: "Mes rapports", icon: <FileText size={16} />, to: "/dashboard/rapports" },
      ],
    },
    {
      key: "Performance",
      title: "Performance",
      icon: <File size={16} />,
      items: [
        { label: "Mes performances", icon: <FolderOpen size={16} />, to: "/dashboard/performances" },
      ],
    },
  ],

  superviseur: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: <HomeIcon className="w-4 h-4" />,
      to: "/dashboard",
    },
    {
      key: "tickets",
      title: "Tickets",
      icon: <Ticket size={16} />,
      items: [
        { label: "À traiter", icon: <ClipboardList size={16} />, to: "/dashboard/tickets/a-traiter"},
        { label: "Escalades", icon: <UserPlus size={16} />, to: "/dashboard/tickets/escalades" },
        { label: "Historique", icon: <History size={16} />, to: "/dashboard/tickets/clotures" },
      ],
    },
    {
      key: "techniciens",
      title: "Techniciens",
      icon: <Users size={16} />,
      items: [
        { label: "Suivi charge", icon: <BarChart2 size={16} />, to: "/dashboard/techniciens/charge" },
        
      ],
    },
  ],

  personnel: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: <HomeIcon className="w-4 h-4" />,
      to: "/dashboard",
    },
    {
      key: "mes_tickets",
      title: "Mes Tickets",
      icon: <Ticket size={16} />,
      items: [
        { label: "Voir tickets", icon: <ClipboardList size={16} />, to: "/dashboard/tickets" },
        { label: "Créer ticket", icon: <PlusSquare size={16} />, to: "/dashboard/tickets/nouveau" },
      ],
    },
    {
      key: "mes_clients",
      title: "Projets/Sociétés",
      icon: <Building2 size={16} />,
      items: [
        { label: "Liste", icon: <Building2 size={16} />, to: "/dashboard/clients" },
      ],
    },
    {
      key: "mes_fichiers",
      title: "Fichiers",
      icon: <File size={16} />,
      items: [
        { label: "Voir fichiers associés", icon: <FolderOpen size={16} />, to: "/dashboard/fichiers" },
      ],
    },
  ],
};

const getWelcomeMessage = (role: string): string => {
  switch (role.toLowerCase()) {
    case "administrateur":
      return "Bienvenue dans votre espace administrateur 👑";
    case "technicien":
      return "Bienvenue technicien 👨‍💻, prêt à résoudre des tickets ?";
    case "superviseur":
      return "Bienvenue superviseur 🧭, surveillez bien les interventions !";
    case "personnel":
      return "Bienvenue sur le portail de support TechExpert 🙋‍♂️";
    default:
      return "Bienvenue sur votre tableau de bord 🚀";
  }
};

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Au revoir 👋");
    navigate("/support");
  };

  const user: User | string = JSON.parse(localStorage.getItem("user") || "");
  if (typeof user === "string") return null;

  const sections =
    sidebarSections[
      user.roles!.length === 2 ? "superviseur" : (user.roles![0].nom as Role)
    ];

  const toggleSection = (key: string) => {
    setActiveSection((prev) => (prev === key ? null : key));
  };

  return (
    <aside className="w-64 h-full bg-white p-6 shadow-md flex flex-col justify-between">
      {/* Profil utilisateur */}
      <div>
        <div className="font-bold text-xl text-gray-800">
          {user.prenom} {user.nom}
        </div>
        <div className="text-sm text-gray-500">{user.email}</div>
        <div className="text-xs text-gray-400 italic mt-1">
          Rôle :{" "}
          {user.roles?.map((i) => (
            <span key={i.nom}>{i.nom}</span>
          ))}
        </div>

        {/* Message de bienvenue */}
        <div className="mt-4 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-md p-3">
          {getWelcomeMessage(user.roles?.[0]?.nom || "")}
        </div>

        {/* Navigation */}
        <ul className="w-full min-h-[350px] mt-5 space-y-2 text-sm">
          {sections.map((section) => {
            const hasSubItems = Array.isArray(section.items) && section.items.length > 0;

            return (
              <li key={section.key}>
                {hasSubItems ? (
                  <>
                    <div
                      onClick={() => toggleSection(section.key)}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer transition-all"
                    >
                      <span className="font-medium flex items-center gap-x-2">
                        {section.icon} {section.title}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-300",
                          activeSection === section.key ? "-rotate-90" : ""
                        )}
                      />
                    </div>
                    <ul
                      className={cn(
                        "pl-4 mt-2 space-y-1 transition-all duration-160 ease-in-out",
                        activeSection === section.key ? "block" : "hidden"
                      )}
                    >
                      {section?.items?.map((item, idx) => (
                        <li
                          key={idx}
                          onClick={() => item.to && navigate(item.to)}
                          className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-x-3"
                        >
                          {item.icon}
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div
                    onClick={() => section.to && navigate(section.to)}
                    className="flex items-center gap-x-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <span className="font-medium flex items-center gap-x-2">
                      {section.icon} {section.title}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Déconnexion */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 text-sm px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition font-semibold shadow"
      >
        Déconnexion
      </button>
    </aside>
  );
};

export default Sidebar;
