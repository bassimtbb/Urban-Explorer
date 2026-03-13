/**
 * @file index.ts
 * @description Définition centralisée des Types et Interfaces TypeScript (TS) pour tout le projet.
 * Assure la cohérence des données transitant entre l'API, les Contextes et les Écrans.
 */

/**
 * Typage correspondant au format natif récupéré de l'API Paris (GPS lat/lon array ou object)
 */
export interface CoordonneesGeo {
  lat: number;
  lon: number;
}

/**
 * Structure principale d'un "Record" de l'API Que Faire à Paris.
 * Définit avec précision chaque clé de données exploitée par l'application Native.
 */
export interface Lieu {
  id: string; // Identifiant unique 
  title: string; // Titre du lieu/événement
  lead_text: string; // Description courte (chapeau)
  description: string; // Description longue HTML (optionnelle si renderisée)
  date_start: string; 
  date_end: string;
  cover_url: string; // URL directe vers l'image principale
  address_name: string; // Nom de l'établissement du lieu (ex "Stade de France")
  address_street: string; // Numéro et nom de rue
  address_zipcode: string;
  address_city: string; // La ville associée
  lat_lon: CoordonneesGeo | null; // L'objet custom TS créé plus haut. Peut valoir Null si l'API est incomplète
  price_type: string; // ex: 'gratuit', 'payant'
  contact_url: string | null; // URL site réservation (Nullable strict)
}