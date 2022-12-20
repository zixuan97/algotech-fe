export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export enum UserRole {
  ADMIN = 'ADMIN',
  INTERN = 'INTERN',
  PARTTIME = 'PARTTIME',
  FULLTIME = 'FULLTIME',
  CUSTOMER = 'CUSTOMER',
  B2B = 'B2B'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
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
  CREATED = 'CREATED',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  PREPARED = 'PREPARED',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum ShippingType {
  MANUAL = 'MANUAL',
  SHIPPIT = 'SHIPPIT',
  NINJAVAN = 'NINJAVAN',
  GRAB = 'GRAB'
}

export enum PlatformType {
  LAZADA = 'LAZADA',
  REDMART = 'REDMART',
  SHOPIFY = 'SHOPIFY',
  SHOPEE = 'SHOPEE',
  OTHERS = 'OTHERS',
  B2B = 'B2B'
}

export enum DeliveryMode {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  PRIORITY = 'PRIORITY'
}
export enum PaymentMode {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYNOW = 'PAYNOW'
}

export enum BulkOrderStatus {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED'
}

export enum JobStatus {
  SENT = 'SENT',
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED'
}

export enum DiscountCodeType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT_AMOUNT = 'FLAT_AMOUNT'
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
  company?: string;
  contactNo?: string;
  tier: string;
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
  stockQuantity: StockQuantity[];
}

export interface StockQuantity {
  productId?: number;
  product?: Product;
  locationId?: number;
  location?: Location;
  quantity: number;
}

export interface Bundle {
  id: number;
  name: string;
  description: string;
  bundleProduct: BundleProduct[];
}

export interface BundleProduct {
  product: Product;
  productId: number;
  quantity: number;
}

export interface ProductCatalogue {
  id: number;
  price: number;
  product: Product;
  productId: number;
  image?: string;
  file?: File;
  description: string;
}

export interface BundleCatalogue {
  id: number;
  price: number;
  bundle: Bundle;
  bundleId: number;
  image?: string;
  file?: File;
  description: string;
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
  currency: string;
  supplierProduct: SupplierProduct[];
}

export interface SupplierProduct {
  product: Product;
  rate: number;
}

export interface DeliveryStatus {
  status: string;
  statusOwner: string;
  date: string;
  timestamp: string;
  deliveryOrderId: number;
}

export interface DeliveryOrder {
  id: number;
  shippingDate: Date;
  deliveryDate?: Date;
  shippingType: ShippingType;
  currentLocation: string;
  eta: Date;
  salesOrder: SalesOrder;
  salesOrderId: number;
  courierType?: string;
  comments?: string;
  assignedUser?: User;
  method?: string;
  carrier?: string;
  parcelQty?: number;
  parcelWeight?: number;
  deliveryMode?: DeliveryMode;
  assignedUserId?: number;
  shippitTrackingNum: string;
  deliveryStatus?: DeliveryStatus;
}

export interface SalesOrder {
  id: number;
  orderId: string;
  customerName?: string;
  customerAddress: string;
  postalCode: string;
  customerContactNo: string;
  customerEmail?: string;
  platformType: PlatformType;
  createdTime: Date;
  currency: string;
  amount: number;
  orderStatus: OrderStatus;
  customerRemarks?: string;
  salesOrderItems: SalesOrderItem[];
}
export interface SalesOrderItem {
  id: number;
  salesOrderId: number;
  price: number;
  quantity: number;
  productName?: string;
  createdTime?: Date;
  isNewAdded?: boolean;
  salesOrderBundleItems: SalesOrderBundleItem[];
}

export interface SalesOrderBundleItem {
  id?: number;
  salesOrderItemId?: number;
  productName: string;
  quantity: number;
  isNewAdded?: boolean;
}

export interface DailySales {
  // TODO: change to number once BE is fixed
  salesorders: number;
  createddate: Date;
}

export interface SalesBestseller {
  quantity: number;
  productname: string;
}

export interface SalesRevenue {
  revenue: number;
  createddate: Date;
}

export interface SupplierProductInfo {
  supplierId: number;
  productId: number;
  rate: number;
}

export interface ProductSalesQty {
  quantity: number;
  createddate: Date;
}
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: number;
  lastOrderDate?: Date;
  totalSpent: number;
  ordersCount: number;
  salesOrders: SalesOrder[];
  ordersByMonth: [];
  bulkOrdersByMonth: [];
  bulkOrders: BulkOrder[];
  // daysSinceLastOrder?: number;
  // newsletters?: Newsletter[];
}

export interface CustomerOrderValue {
  month: Date;
  totalamount: number;
  numorders: number;
}

export interface BulkOrder {
  id: number;
  orderId: number;
  amount: number;
  paymentMode: PaymentMode;
  payeeName: String;
  payeeEmail: String;
  payeeCompany: String;
  payeeRemarks: String;
  bulkOrderStatus: BulkOrderStatus;
  payeeContactNo: String;
  createdTime: Date;
  salesOrders: SalesOrder[];
}

export interface NewsletterTemplate {
  id: number;
  name: String;
  emailSubject: String;
  emailBodyTitle: String;
  emailBody: String;
  discountCode: String;
}

export interface ScheduledNewsletter {
  id: number;
  newsletterId: number;
  customerEmails: String[];
  sentDate: Date;
  jobStatus: JobStatus;
  newsletter: NewsletterTemplate;
  jobId: String;
}

export interface LalamoveDriverContactInfo {
  name: String;
  phone: String;
}

export interface LalamoveDriver {
  plateNumber: String;
  contact: LalamoveDriverContactInfo;
}

export interface DiscountCode {
  id: number;
  discountCode: string;
  amount: number;
  minOrderAmount: number;
  startDate: Date;
  endDate?: Date;
  customerEmails: string[];
  type: DiscountCodeType;
  isEnabled: boolean;
}
