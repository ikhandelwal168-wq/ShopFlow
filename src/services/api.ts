import axios from 'axios';
import type { 
  Subscription, 
  User, 
  Transaction, 
  DetectedSubscription,
  SubscriptionAnalytics,
  Alternative 
} from '../types';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authApi = {
  register: async (email: string, password: string, name?: string) => {
    const { data } = await api.post<{ user: User; token: string }>('/auth/register', {
      email,
      password,
      name,
    });
    return data;
  },
  
  login: async (email: string, password: string) => {
    const { data } = await api.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });
    return data;
  },
  
  getMe: async () => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};

// Plaid endpoints
export const plaidApi = {
  createLinkToken: async () => {
    const { data } = await api.post<{ linkToken: string }>('/plaid/create-link-token');
    return data;
  },
  
  exchangeToken: async (publicToken: string) => {
    const { data } = await api.post('/plaid/exchange-token', { publicToken });
    return data;
  },
  
  getTransactions: async () => {
    const { data } = await api.get<Transaction[]>('/plaid/transactions');
    return data;
  },
};

// Subscription endpoints
export const subscriptionApi = {
  getAll: async () => {
    const { data } = await api.get<Subscription[]>('/subscriptions');
    return data;
  },
  
  create: async (subscription: Omit<Subscription, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const { data } = await api.post<Subscription>('/subscriptions', subscription);
    return data;
  },
  
  update: async (id: string, updates: Partial<Subscription>) => {
    const { data } = await api.put<Subscription>(`/subscriptions/${id}`, updates);
    return data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/subscriptions/${id}`);
  },
  
  detect: async () => {
    const { data } = await api.post<DetectedSubscription[]>('/subscriptions/detect');
    return data;
  },
  
  getAnalytics: async () => {
    const { data } = await api.get<SubscriptionAnalytics>('/subscriptions/analytics');
    return data;
  },
};

// Alternatives endpoints
export const alternativesApi = {
  getAlternatives: async (serviceName: string) => {
    const { data } = await api.get<Alternative>(`/alternatives/${serviceName}`);
    return data;
  },
  
  getSavings: async () => {
    const { data } = await api.get<{ potentialSavings: number }>('/alternatives/savings');
    return data;
  },
};
