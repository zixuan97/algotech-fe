// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT

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

export interface User {
  id?: number;
  email: string;
  role: string;
  status: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface Category {
  name: string;
  id: number;
  ProductCategory: ProductCategory[];
}

export interface Brand {
  name: string;
  id: number;
  Product: Product[];
}

export interface ProductCategory {
  product_sku: string;
  category_id: number;
  category_name: string;
  category: Category;
  product: Product;
}

export interface Product {
  name: string;
  description?: string;
  image?: string;
  sku: string;
  id: number;
  brand_id: number;
  qtyThreshold?: number;
  brand: Brand;
  productCategory: ProductCategory[];
  stockQuantity: StockQuantity[];
}

export interface Location {
  name: string;
  details: string;
  id: number;
  StockQuantity: StockQuantity[];
}

export interface StockQuantity {
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  location_id: number;
  product_id: number;
  location: Location;
  product: Product;
}

export interface Bundle {
  id: number;
  name: string;
  description: string;
  price: number;
}
