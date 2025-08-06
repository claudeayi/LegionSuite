// Types de base pour le module ERP
export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  quantity: number;
  minStock: number;
  supplier: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InventoryAdjustment = {
  id: string;
  productId: string;
  quantity: number;
  reason: 'receipt' | 'return' | 'adjustment' | 'damage' | 'other';
  notes: string;
  date: Date;
};

export type Order = {
  id: string;
  customerId: string;
  orderDate: Date;
  status: 'draft' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type WorkOrder = {
  id: string;
  productId: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  materials: WorkOrderMaterial[];
};

export type WorkOrderMaterial = {
  materialId: string;
  quantity: number;
  unitCost: number;
};

export type Invoice = {
  id: string;
  orderId: string;
  issueDate: Date;
  dueDate: Date;
  amount: number;
  paid: boolean;
  paymentDate?: Date;
};

export type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: Date;
  salary: number;
};