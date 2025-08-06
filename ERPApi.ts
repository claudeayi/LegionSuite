import api from '../../../core/services/api';

const ERPService = {
  // Finance
  getFinancialData: () => api.get('/erp/finance/overview'),
  getAccounts: () => api.get('/erp/finance/accounts'),
  getTransactions: (params) => api.get('/erp/finance/transactions', { params }),
  
  // Inventory
  getInventory: () => api.get('/erp/inventory'),
  getProduct: (id) => api.get(`/erp/inventory/${id}`),
  createProduct: (data) => api.post('/erp/inventory', data),
  updateProduct: (id, data) => api.put(`/erp/inventory/${id}`, data),
  deleteProduct: (id) => api.delete(`/erp/inventory/${id}`),
  
  // Production
  getProductionOrders: () => api.get('/erp/production/orders'),
  createProductionOrder: (data) => api.post('/erp/production/orders', data),
  updateProductionOrder: (id, data) => api.put(`/erp/production/orders/${id}`, data),
  
  // HR
  getEmployees: () => api.get('/erp/hr/employees'),
  getEmployee: (id) => api.get(`/erp/hr/employees/${id}`),
  createEmployee: (data) => api.post('/erp/hr/employees', data),
  updateEmployee: (id, data) => api.put(`/erp/hr/employees/${id}`, data),
  
  // Projects
  getProjects: () => api.get('/erp/projects'),
  getProjectTasks: (projectId) => api.get(`/erp/projects/${projectId}/tasks`)
};

export default ERPService;