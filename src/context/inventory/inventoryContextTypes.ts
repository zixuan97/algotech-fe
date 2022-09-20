import { Brand, Category, Location, Product } from 'src/models/types';

export interface InventoryStateAttr {
  products: Product[];
  brands: Brand[];
  locations: Location[];
  categories: Category[];
}

export interface InventoryStateInit extends InventoryStateAttr {
  refreshProducts: (callback?: (products: Product[]) => void) => void;
  refreshBrands: (callback?: (brands: Brand[]) => void) => void;
  refreshLocations: (callback?: (locations: Location[]) => void) => void;
  refreshCategories: (callback?: (categories: Category[]) => void) => void;
}

export type InventoryAction = {
  type: InventoryActionTypes;
  payload?: any;
};

export enum InventoryActionTypes {
  UPDATE_PRODUCTS = 'UPDATE_PRODUCTS',
  UPDATE_BRANDS = 'UPDATE_BRANDS',
  UPDATE_LOCATIONS = 'UPDATE_LOCATIONS',
  UPDATE_CATEGORIES = 'UPDATE_CATEGORIES'
}
