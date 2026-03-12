export interface CoordonneesGeo {
  lat: number;
  lon: number;
}

export interface Lieu {
  id: string;
  title: string;
  lead_text: string;
  description: string;
  date_start: string;
  date_end: string;
  cover_url: string;
  address_name: string;
  address_street: string;
  address_zipcode: string;
  address_city: string;
  lat_lon: CoordonneesGeo | null;
  price_type: string;
  contact_url: string | null;
}