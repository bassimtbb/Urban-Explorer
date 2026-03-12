export interface CoordonneesGeo {
  lat: number;
  lon: number;
}

export interface Lieu {
  nom_usuel: string;
  adresse: string;
  coordonnees_geo: CoordonneesGeo;
}
