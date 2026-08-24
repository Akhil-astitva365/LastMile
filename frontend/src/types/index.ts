export type Role = 'CUSTOMER' | 'DELIVERY_AGENT' | 'ADMIN';
export type OrderType = 'B2B' | 'B2C';
export type PaymentType = 'PREPAID' | 'COD';
export type ZoneType = 'INTRA_ZONE' | 'INTER_ZONE';

export type OrderStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'DISPATCHED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'FAILED_DELIVERY'
  | 'RESCHEDULED'
  | 'RETURNED';

export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE' | 'ON_DELIVERY';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  token?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface OrderQuoteRequest {
  pickupAddress: string;
  dropAddress: string;
  length: number;
  breadth: number;
  height: number;
  actualWeight: number;
  orderType: OrderType;
  paymentType: PaymentType;
}

export interface OrderQuoteResponse {
  actualWeight: number;
  volumetricWeight: number;
  billableWeight: number;
  pickupZoneCode: string;
  pickupZoneName: string;
  dropZoneCode: string;
  dropZoneName: string;
  zoneType: ZoneType;
  orderType: OrderType;
  paymentType: PaymentType;
  baseCharge: number;
  codSurcharge: number;
  finalCharge: number;
}

export interface CreateOrderRequest extends OrderQuoteRequest {
  customerUserId?: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  pickupAddress: string;
  pickupZoneCode?: string;
  pickupZoneName?: string;
  dropAddress: string;
  dropZoneCode?: string;
  dropZoneName?: string;
  zoneType: ZoneType;
  orderType: OrderType;
  paymentType: PaymentType;
  length: number;
  breadth: number;
  height: number;
  actualWeight: number;
  volumetricWeight: number;
  billableWeight: number;
  baseCharge: number;
  codSurcharge: number;
  finalCharge: number;
  status: OrderStatus;
  deliveryDate: string;
  assignedAgentId?: number;
  assignedAgentName?: string;
  assignedAgentPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  id: number;
  orderId: number;
  previousStatus?: OrderStatus;
  newStatus: OrderStatus;
  actorId?: number;
  actorRole: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
  createdAt: string;
}

export interface DeliveryAgent {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  employeeCode: string;
  availabilityStatus: AvailabilityStatus;
  latitude?: number;
  longitude?: number;
  currentOrderId?: number;
  zone?: {
    id: number;
    zoneCode: string;
    zoneName: string;
  };
}

export interface Zone {
  id: number;
  zoneCode: string;
  zoneName: string;
  status: string;
  areas?: {
    id: number;
    areaName: string;
    pincode: string;
  }[];
}

export interface RateCard {
  id: number;
  orderType: OrderType;
  zoneType: ZoneType;
  minWeight: number;
  maxWeight: number;
  baseCharge: number;
  perKgCharge: number;
  active: boolean;
}
