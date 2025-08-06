import React, { createContext, useContext, useState, useEffect } from 'react';
import ErpService from '../services/erpApi';
import {
  Product, Order, WorkOrder, Invoice, Employee
} from '../types/erpTypes';

interface ErpContextType {
  products: Product[];
  orders: Order[];
  workOrders: WorkOrder[];
  invoices: Invoice[];
  employees: Employee[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshWorkOrders: () => Promise<void>;
  refreshInvoices: () => Promise<void>;
  refreshEmployees: () => Promise<void>;
}

const ErpContext = createContext<ErpContextType | undefined>(undefined);

export const ErpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData, workOrdersData, invoicesData, employeesData] = await Promise.all([
        ErpService.getProducts(),
        ErpService.getOrders(),
        ErpService.getWorkOrders(),
        ErpService.getInvoices(),
        ErpService.getEmployees()
      ]);
      
      setProducts(productsData);
      setOrders(ordersData);
      setWorkOrders(workOrdersData);
      setInvoices(invoicesData);
      setEmployees(employeesData);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données ERP');
      console.error('ErpContext fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshProducts = async () => {
    try {
      const data = await ErpService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Erreur de rafraîchissement des produits');
    }
  };

  const refreshOrders = async () => {
    try {
      const data = await ErpService.getOrders();
      setOrders(data);
    } catch (err) {
      setError('Erreur de rafraîchissement des commandes');
    }
  };

  const refreshWorkOrders = async () => {
    try {
      const data = await ErpService.getWorkOrders();
      setWorkOrders(data);
    } catch (err) {
      setError('Erreur de rafraîchissement des ordres de production');
    }
  };

  const refreshInvoices = async () => {
    try {
      const data = await ErpService.getInvoices();
      setInvoices(data);
    } catch (err) {
      setError('Erreur de rafraîchissement des factures');
    }
  };

  const refreshEmployees = async () => {
    try {
      const data = await ErpService.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Erreur de rafraîchissement des employés');
    }
  };

  return (
    <ErpContext.Provider
      value={{
        products,
        orders,
        workOrders,
        invoices,
        employees,
        loading,
        error,
        refreshProducts,
        refreshOrders,
        refreshWorkOrders,
        refreshInvoices,
        refreshEmployees
      }}
    >
      {children}
    </ErpContext.Provider>
  );
};

export const useErpContext = () => {
  const context = useContext(ErpContext);
  if (!context) {
    throw new Error('useErpContext must be used within an ErpProvider');
  }
  return context;
};