import api from '../../../core/services/api';

const CRMService = {
  // Clients
  getClients: (params = {}) => api.get('/crm/clients', { params }),
  getClient: (id) => api.get(`/crm/clients/${id}`),
  createClient: (data) => api.post('/crm/clients', data),
  updateClient: (id, data) => api.put(`/crm/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/crm/clients/${id}`),
  
  // Transactions
  getDeals: (params = {}) => api.get('/crm/deals', { params }),
  getDeal: (id) => api.get(`/crm/deals/${id}`),
  createDeal: (data) => api.post('/crm/deals', data),
  updateDeal: (id, data) => api.put(`/crm/deals/${id}`, data),
  deleteDeal: (id) => api.delete(`/crm/deals/${id}`),
  
  // Activités
  getActivities: (params = {}) => api.get('/crm/activities', { params }),
  logActivity: (data) => api.post('/crm/activities', data),
  
  // Métriques
  getMetrics: (params = {}) => api.get('/crm/metrics', { params }),
  
  // Contacts
  getContacts: (clientId) => api.get(`/crm/clients/${clientId}/contacts`),
  addContact: (clientId, data) => api.post(`/crm/clients/${clientId}/contacts`, data),
  
  // Notes
  getNotes: (entityType, entityId) => 
    api.get(`/crm/notes?entityType=${entityType}&entityId=${entityId}`),
  addNote: (data) => api.post('/crm/notes', data)
};

export default CRMService;