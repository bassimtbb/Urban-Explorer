/**
 * @file api.ts
 * @description Service responsable des requêtes réseau vers l'API Open Data de Paris.
 * Utilise `axios` pour configurer le fetch.
 */
import axios from 'axios';
import { Lieu } from '../types';

// URL racine (Endpoint Rest) pour récupérer le dataset culturel de Paris
const API_URL =
  'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records';

/**
 * Fonction asynchrone pour interroger l'API distante.
 * 
 * @returns {Promise<Lieu[]>} Promesse contenant un tableau de propriétés formaté (selon src/types/index.ts)
 */
export const fetchLieux = async (): Promise<Lieu[]> => {
  try {
    // Axios request : On limite volontairement à 30 résultats (pour de la performance réseau)
    const response = await axios.get(`${API_URL}?limit=30`);

    // Vérification de sécurité du Payload de réponse
    if (!response.data || !response.data.results) {
      return [];
    }

    // Le tableau brut retourné par l'API Paris Open Data (directement un tableau de records JSON)
    return response.data.results;
  } catch (error) {
    console.error('Erreur API:', error); // Log console si Axios crash (problème CORS, no wifi...)
    return []; // Fallback empty Array si crash complet, pour la sécurité du UI Render
  }
};