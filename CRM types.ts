// Types de base CRM
export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: 'lead' | 'active' | 'inactive' | 'former';
  tags: string[];
  address: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Deal = {
  id: string;
  name: string;
  value: number;
  stage: 'prospect' | 'qualification' | 'proposition' | 'negociation' | 'cloture';
  clientId: string;
  expectedClose: Date;
  probability: number;
  priority: 'low' | 'medium' | 'high';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Activity = {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'task' | 'note' | 'event';
  subject: string;
  description: string;
  relatedTo: 'client' | 'deal';
  relatedId: string;
  date: Date;
  duration?: number;
  participants: string[];
  tags: string[];
  createdAt: Date;
};

export type Contact = {
  id: string;
  clientId: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  notes: string;
};

export type CrmMetric = {
  stage: string;
  count: number;
  value: number;
};

export type RevenueTrend = {
  period: string;
  closed: number;
  expected: number;
};