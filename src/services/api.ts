import axios from 'axios';
import { Lieu } from '../types';

const API_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/equipements-publics/records'; // API publique de la Ville de Paris à titre d'exemple.

export const fetchLieux = async (): Promise<Lieu[]> => {
  try {
    // limit=30 est exigé par les instructions
    const response = await axios.get(`${API_URL}?limit=30`);
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux:', error);
    throw error;
  }
};
