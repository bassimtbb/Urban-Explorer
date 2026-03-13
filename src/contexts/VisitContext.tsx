/**
 * @file VisitContext.tsx
 * @description Contexte React (`createContext`) servant de magasin global de l'application
 * pour la gestion des "Visites Planifiées". Il expose son State et ses méthodes de modification 
 * à tous les enfants (écrans). Couple nativement l'état local du State avec AsyncStorage.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lieu } from '../types';

/** Structure modélisant un événement "Visite" : le jour + la structure complète du lieu OpenData API */
interface PlannedVisit {
  date: string;
  lieu: Lieu;
}

// Typage en dictionnaire : la clé de la structure sera toujours l'iD du Lieu pour un O(1) Fetching
type PlannedVisits = Record<string, PlannedVisit>; 

// Définitions strictes des méthodes de base qu'exposera le provider
interface VisitContextType {
  plannedVisits: PlannedVisits;
  planVisit: (lieuId: string, date: string, lieu: Lieu) => void;
  cancelVisit: (lieuId: string) => void;
  getPlannedDate: (lieuId: string) => string | undefined;
  getAllPlannedVisits: () => PlannedVisit[];
  isLoaded: boolean;
}

// Initialisation vide mais typée
const VisitContext = createContext<VisitContextType>({
  plannedVisits: {},
  planVisit: () => {},
  cancelVisit: () => {},
  getPlannedDate: () => undefined,
  getAllPlannedVisits: () => [],
  isLoaded: false,
});

/** 
 * Custom hook facilitant la consommation du contexte 
 * depuis n'importe quel écran fonctionnel (ex const { planVisit } = useVisits()) 
 */
export const useVisits = () => useContext(VisitContext);

const PLANNED_VISITS_KEY = '@planned_visits';

/**
 * Encapsuleur principal devant idéalement entourer les Nodes 
 * de plus haute hiérarchie (dans App.tsx).
 */
export const VisitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plannedVisits, setPlannedVisits] = useState<PlannedVisits>({});
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Effet Initial : Au lancement (Montage) de l'application "App.tsx", 
   * charge l'ensemble des données dictionnaire de visites stockées dans AsyncStorage.
   */
  useEffect(() => {
    const loadVisits = async () => {
      try {
        const storedVisits = await AsyncStorage.getItem(PLANNED_VISITS_KEY);
        // Les datas AsyncStorage étant des strings (Stringified Json), on doit Parse pour rehydrater le Memory State
        if (storedVisits) {
          setPlannedVisits(JSON.parse(storedVisits));
        }
      } catch (e) {
        console.error('Erreur chargement des visites:', e);
      } finally {
        setIsLoaded(true); // Signale que la persistence a retourné l'état de démarrage 
      }
    };
    loadVisits();
  }, []); // Run Once au BOOT

  /**
   * Effet Relai : Si plannedVisits mute (planification ou annulation effectuée par un enfant Screen),
   * on met en cache cette nouvelle version de données sur la base de données asynchrone pour 
   * une durabilité app-restart.
   */
  useEffect(() => {
    if (isLoaded) {
      // Stringify garantit qu'on serializa le dictionnaire local d'objets complet vers du FlatText pour AsyncStorage native
      AsyncStorage.setItem(PLANNED_VISITS_KEY, JSON.stringify(plannedVisits)).catch(e => {
        console.error('Erreur sauvegarde des visites:', e);
      });
    }
  }, [plannedVisits, isLoaded]); // S'exécute à chaque mutation de variable

  /**
   * Action Provider (Redux-Like) ajoutant ou remplaçant de manière immuable 
   * l'objet planning dans le store
   */
  const planVisit = (lieuId: string, date: string, lieu: Lieu) => {
    setPlannedVisits((prev) => ({ ...prev, [lieuId]: { date, lieu } }));
  };

  /**
   * Action Provider supprimant manuellement `lieuId` du dictionnaire Memory State. 
   */
  const cancelVisit = (lieuId: string) => {
    setPlannedVisits((prev) => {
      const updated = { ...prev };
      delete updated[lieuId];
      return updated;
    });
  };

  /** Helpeur O(1) de contrôle : Est-ce que cette Page détail ID a une visite existante ? */
  const getPlannedDate = (lieuId: string) => plannedVisits[lieuId]?.date;

  /** Helpeur Array : Transforme le Record en simple liste [ ] pour Flatlist Consommation dnas PlanningScreen */
  const getAllPlannedVisits = () => Object.values(plannedVisits);

  return (
    // Toutes ces fonctions/states sont "Fournies" (Provided) aux `<children>` (NavigationContainer, Screens)
    <VisitContext.Provider value={{ plannedVisits, planVisit, cancelVisit, getPlannedDate, getAllPlannedVisits, isLoaded }}>
      {children}
    </VisitContext.Provider>
  );
};
