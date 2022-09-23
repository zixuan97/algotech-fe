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
  PLACED = 'PLACED',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  PREPARED = 'PREPARED', //Create New DO, associate to SalesOrder, status = READY_FOR_DELIVERY
  SHIPPED = 'SHIPPED', //Update associated DO, status = DELIVERY_IN_PROGRESS
  DELIVERED = 'DELIVERED' //Update associated DO, status = DELIVERED
  //not completed, need to wait for backend
}

export enum DeliveryStatus {
  READYFORDELIVERY = 'READY_FOR_DELIVERY',
  DELIVERYINPROGRESS = 'DELIVERY_IN_PROGRESS',
  DELIVERED = 'DELIVERED'
  //not completed, need to wait for backend
}

export enum ShippingType {
  MANUAL = 'MANUAL',
  SHIPPIT = 'SHIPPIT',
  NINJAVAN = 'NINJAVAN',
  GRAB = 'GRAB'
}

export enum PlatformType {
  OTHERS = 'OTHERS',
  SHOPIFY = 'SHOPIFY',
  SHOPEE = 'SHOPEE',
  LAZADA = 'LAZADA',
  REDMART = 'REDMART'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
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
  // price: number;
  bundleProduct: Product[];
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
  deliveryStatus: DeliveryStatus;
  shippingDate: Date;
  shippingType: ShippingType;
  currentLocation: string;
  eta: Date;
}
export interface SalesOrder {
  id: number;
  orderId: string;
  platformType: PlatformType;
  status: OrderStatus;
  createdTime: Date;
  customerName?: string;
  customerAddress?: string;
  postalCode?: string;
  customerContactNo: string;
  customerEmail?: string;
  currency: string;
  amount: number;
  deliveryOrder?: DeliveryOrder;
  salesOrderItems: SalesOrderItem[];
}
export interface SalesOrderItem {
  saleOrderId: number;
  price: number;
  quantity: number;
  productName?: string;
}
