import axios from 'axios';
import { Lieu } from '../types';

// API publique Open Data de la Ville de Paris
const API_URL =
  'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records';

/**
 * Récupère la liste des lieux parisiens depuis l'API Open Data Paris.
 * @returns Un tableau d'objets Lieu (limité à 30 résultats).
 */
export const fetchLieux = async (): Promise<Lieu[]> => {
  try {
    const response = await axios.get(API_URL, {
      params: { limit: 30 },
    });
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux :', error);
    throw error;
  }
};
