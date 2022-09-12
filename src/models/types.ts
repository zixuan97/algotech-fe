// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT


export enum UserRole {
  ADMIN = 'ADMIN',
  INTERN = 'INTERN',
  PARTTIME = 'PARTTIME',
  FULLTIME = 'FULLTIME',
  CUSTOMER = 'CUSTOMER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum FulfilmentStatus {
  CREATED = 'CREATED',
  ARRIVED = 'ARRIVED',
  COMPLETED = 'COMPLETED',
}


export interface User {
  id: number | undefined,
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  role: '',
  status: '',
}

export interface Category {
  id: number,
  name: string,
  productCategory: ProductCategory[],
}

export interface Brand {
  id: number,
  name: string,
  product: Product[],
}

export interface ProductCategory {
  product_id: number,
  product_sku: string,
  category_name: string,
  category_id: number,
  category: Category,
  product: Product,
}

export interface Product {
  id: number,
  sku: string,
  name: string,
  description?: string,
  image?: string,
  qtyThreshold?: number,
  brand_id: number,
  brand: Brand,
  bundleProduct: BundleProduct[],
  productCategory: ProductCategory[],
  stockQuantity: StockQuantity[],
}

export interface Location {
  id: number,
  name: string,
  address: string,
  stockQuantity: StockQuantity[],
}

export interface StockQuantity {
  product_id: number,
  product_name: string,
  product_sku: string,
  location_id: number,
  quantity: number,
  price: number,
  createdAt: Date,
  updatedAt: Date,
  product_qtyThreshold?: number,
  location: Location,
  product: Product,
}

export interface Bundle {
  id: number,
  name: string,
  description: string,
  price: number,
  bundleProduct: BundleProduct[],
}

export interface BundleProduct {
  bundle_id: number,
  product_id: number,
  product_sku: string,
  bundle_name: string,
  bundle: Bundle,
  product: Product,
}

export interface ProcurementOrder {
  id: number,
  order_date: Date,
  description: string,
  payment_status: PaymentStatus,
  fulfilment_status: FulfilmentStatus,
  supplier_id: number,
  supplier: Supplier,
  proc_order_items: ProcurementOrderItem[],
}

export interface ProcurementOrderItem {
  quantity: number,
  proc_order_id: number,
  id: number,
  product_name: string,
  product_sku: string,
  rate: number,
  proc_order: ProcurementOrder,
}

export interface Supplier {
  id: number,
  email: string,
  name: string,
  address: string,
  proc_order_items: ProcurementOrder[],
}
