// src/types.ts

export interface Societe {
  id?: number;
  nom: string;
  // autres champs éventuels
}

export interface Role {
  id?: number;
  nom: string;
  // autres champs éventuels
}

export interface DescriptionType {
  id?: number;
  nom: string;
  // autres champs éventuels
}

export interface Prestation {
  id?: number;
  nom: string;
  // autres champs éventuels
}

export interface TechnicienDetail {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  // autres champs éventuels
}

export interface Ticket {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  description: string;
  commentaire_escalade: string;
  technicien?: TechnicienDetail | null;
  date_creation: string | number | Date;
  description_type_detail?: DescriptionType | null;
  prestation_detail?: Prestation | null;
  role_detail?: Role | null;
  societe_detail?: Societe | null;
  description_type?: DescriptionType;
  societe?: Societe;
  role?: Role;
  prestation?: string;
  statut: string;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role?: string;
}

export interface Supérieur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  // autres champs éventuels
}
