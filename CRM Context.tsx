import React, { createContext, useContext, useState, useEffect } from 'react';
import CrmService from '../services/crmApi';
import { Client, Deal, Activity } from '../types/crmTypes';

interface CrmContextType {
  clients: Client[];
  deals: Deal[];
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refreshClients: () => Promise<void>;
  refreshDeals: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  getClientById: (id: string) => Client | undefined;
  getDealById: (id: string) => Deal | undefined;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsData, dealsData, activitiesData] = await Promise.all([
        CrmService.getClients(),
        CrmService.getDeals(),
        CrmService.getActivities({ limit: 100 })
      ]);
      
      setClients(clientsData);
      setDeals(dealsData);
      setActivities(activitiesData);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données CRM');
      console.error('CrmContext fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshClients = async () => {
    try {
      const data = await CrmService.getClients();
      setClients(data);
    } catch (err) {
      setError('Erreur de rafraîchissement des clients');
    }
  };

  const refreshDeals = async () => {
    try {
      const data = await CrmService.getDeals();
      setDeals(data);
    } catch (err) {
      setError('Erreur de rafraîchissement des transactions');
    }
  };

  const refreshActivities = async () => {
    try {
      const data = await CrmService.getActivities({ limit: 100 });
      setActivities(data);
    } catch (err) {
      setError('Erreur de rafraîchissement des activités');
    }
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const getDealById = (id: string) => {
    return deals.find(deal => deal.id === id);
  };

  return (
    <CrmContext.Provider
      value={{
        clients,
        deals,
        activities,
        loading,
        error,
        refreshClients,
        refreshDeals,
        refreshActivities,
        getClientById,
        getDealById
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrmContext = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrmContext must be used within a CrmProvider');
  }
  return context;
};