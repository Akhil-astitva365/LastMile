import axios from 'axios';
import {
  AuthResponse,
  CreateOrderRequest,
  DeliveryAgent,
  Order,
  OrderQuoteRequest,
  OrderQuoteResponse,
  OrderStatus,
  RateCard,
  TrackingEvent,
  Zone,
} from '../types';

const API_BASE = '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (data: any): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
};

export const orderApi = {
  getQuote: async (data: OrderQuoteRequest): Promise<OrderQuoteResponse> => {
    const res = await api.post('/orders/quote', data);
    return res.data;
  },
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const res = await api.post('/orders', data);
    return res.data;
  },
  getMyOrders: async (): Promise<Order[]> => {
    const res = await api.get('/orders/my');
    return res.data;
  },
  getOrderById: async (id: number): Promise<Order> => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  getTrackingTimeline: async (id: number): Promise<TrackingEvent[]> => {
    const res = await api.get(`/orders/${id}/tracking`);
    return res.data;
  },
  rescheduleOrder: async (id: number, newDeliveryDate: string, reason?: string, notes?: string): Promise<Order> => {
    const res = await api.post(`/orders/${id}/reschedule`, { newDeliveryDate, reason, notes });
    return res.data;
  },
  deleteOrder: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};

export const agentApi = {
  getAssignedOrders: async (): Promise<Order[]> => {
    const res = await api.get('/agent/orders');
    return res.data;
  },
  updateLocation: async (latitude: number, longitude: number, availabilityStatus?: string) => {
    const res = await api.patch('/agent/location', { latitude, longitude, availabilityStatus });
    return res.data;
  },
  updateStatus: async (orderId: number, status: OrderStatus, remarks?: string, latitude?: number, longitude?: number): Promise<Order> => {
    const res = await api.patch(`/orders/${orderId}/status`, { status, remarks, latitude, longitude });
    return res.data;
  },
  markFailed: async (orderId: number, reason: string, remarks?: string): Promise<Order> => {
    const res = await api.post(`/orders/${orderId}/fail`, { reason, remarks });
    return res.data;
  },
};

export const adminApi = {
  getFilteredOrders: async (filters?: {
    status?: string;
    zoneCode?: string;
    agentId?: number;
    orderType?: string;
    paymentType?: string;
  }): Promise<Order[]> => {
    const res = await api.get('/admin/orders', { params: filters });
    return res.data;
  },
  manualAssign: async (orderId: number, agentId: number): Promise<Order> => {
    const res = await api.post(`/admin/orders/${orderId}/assign?agentId=${agentId}`);
    return res.data;
  },
  autoAssign: async (orderId: number): Promise<Order> => {
    const res = await api.post(`/admin/orders/${orderId}/auto-assign`);
    return res.data;
  },
  overrideStatus: async (orderId: number, status: OrderStatus, remarks?: string): Promise<Order> => {
    const res = await api.patch(`/admin/orders/${orderId}/status`, { status, remarks });
    return res.data;
  },
  getAgents: async (): Promise<DeliveryAgent[]> => {
    const res = await api.get('/admin/agents');
    return res.data;
  },
  getZones: async (): Promise<Zone[]> => {
    const res = await api.get('/admin/zones');
    return res.data;
  },
  getRates: async (): Promise<RateCard[]> => {
    const res = await api.get('/admin/rates');
    return res.data;
  },
};

export default api;
