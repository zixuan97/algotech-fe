export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export enum UserRole {
  ADMIN = 'ADMIN',
  INTERN = 'INTERN',
  PARTTIME = 'PARTTIME',
  FULLTIME = 'FULLTIME',
  CUSTOMER = 'CUSTOMER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID'
}

export enum FulfilmentStatus {
  CREATED = 'CREATED',
  ARRIVED = 'ARRIVED',
  COMPLETED = 'COMPLETED'
}

export enum OrderStatus {
  CREATED = 'CREATED'
  //not completed, need to wait for backend
}

export enum DeliveryStatus {
  DELIVERED = 'DELIVERED'
  //not completed, need to wait for backend
}

export enum ShippingType {
  MANUAL = 'MANUAL',
  SHIPPIT = 'SHIPPIT',
  SHOPIFY = 'SHOPIFY'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  status: string;
  isVerified: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  image?: string;
  qtyThreshold: number;
  brand: Brand;
  categories: Category[];
  stockQuantity: StockQuantity[];
}

export interface Location {
  id: number;
  name: string;
  address: string;
}

export interface StockQuantity {
  productId?: number;
  location: Location;
  price: number;
  quantity: number;
}

export interface Bundle {
  id: number;
  name: string;
  description: string;
  price: number;
  products: Product[];
}

export interface ProcurementOrder {
  id: number;
  orderDate: Date;
  description: string;
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  totalAmount: number;
  supplier: Supplier;
  location: Location;
  procOrderItems: ProcurementOrderItem[];
}

export interface ProcurementOrderItem {
  id: number;
  procOrderId: number;
  quantity: number;
  rate: number;
  product: Product;
}

export interface Supplier {
  id: number;
  email: string;
  name: string;
  address: string;
}

export interface DeliveryOrder {
  id: number;
  orderStatus: OrderStatus;
  deliveryStatus: DeliveryStatus;
  shippingDate: Date;
  shippingAddress: string;
  shippingType: ShippingType;
  currentLocation: string;
  eta: Date;
  paymentId: number;
}
