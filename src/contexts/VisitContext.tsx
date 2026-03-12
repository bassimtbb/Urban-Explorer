import React, { createContext, useContext, useState } from 'react';
import { Lieu } from '../types';

interface PlannedVisit {
  date: string;
  lieu: Lieu;
}

type PlannedVisits = Record<string, PlannedVisit>; // { [lieuId]: { date, lieu } }

interface VisitContextType {
  plannedVisits: PlannedVisits;
  planVisit: (lieuId: string, date: string, lieu: Lieu) => void;
  cancelVisit: (lieuId: string) => void;
  getPlannedDate: (lieuId: string) => string | undefined;
  getAllPlannedVisits: () => PlannedVisit[];
}

const VisitContext = createContext<VisitContextType>({
  plannedVisits: {},
  planVisit: () => {},
  cancelVisit: () => {},
  getPlannedDate: () => undefined,
  getAllPlannedVisits: () => [],
});

export const useVisits = () => useContext(VisitContext);

export const VisitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plannedVisits, setPlannedVisits] = useState<PlannedVisits>({});

  const planVisit = (lieuId: string, date: string, lieu: Lieu) => {
    setPlannedVisits((prev) => ({ ...prev, [lieuId]: { date, lieu } }));
  };

  const cancelVisit = (lieuId: string) => {
    setPlannedVisits((prev) => {
      const updated = { ...prev };
      delete updated[lieuId];
      return updated;
    });
  };

  const getPlannedDate = (lieuId: string) => plannedVisits[lieuId]?.date;

  const getAllPlannedVisits = () => Object.values(plannedVisits);

  return (
    <VisitContext.Provider value={{ plannedVisits, planVisit, cancelVisit, getPlannedDate, getAllPlannedVisits }}>
      {children}
    </VisitContext.Provider>
  );
};
