// src/types.ts
export interface Ticket {
  id: number;
  nom: string;
  prestation: string;
  statut: string;
  societe?: { nom: string };
  role?: { nom: string };
  telephone?: string;
  description_type?: { nom: string };
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role?: string;
}
