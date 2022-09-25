import { randomId } from '@mui/x-data-grid-generator';
import { omit } from 'lodash';
import { Product, StockQuantity, Location, Bundle } from 'src/models/types';
import { BundleProduct } from 'src/pages/inventory/CreateBundle';

export interface StockQuantityGridRow extends StockQuantity {
  gridId: string;
  isNew?: boolean;
}

export const isValidProduct = (
  productToValidate: Partial<Product> | null
): boolean => {
  if (!productToValidate) return false;
  return !!(
    productToValidate.sku &&
    productToValidate.name &&
    productToValidate.brand &&
    productToValidate.qtyThreshold
  );
};

export const convertStockQtyToGridRow = (
  stockQuantity: StockQuantity[]
): StockQuantityGridRow[] => {
  return stockQuantity.map((stockQty) => ({ ...stockQty, gridId: randomId() }));
};

export const convertGridRowToStockQty = (
  stockQuantityGridRows: StockQuantityGridRow[]
): StockQuantity[] => {
  return stockQuantityGridRows.map((stockQty) =>
    omit(stockQty, ['gridId', 'isNew'])
  );
};

export const getAvailableLocations = (
  selectedLocations: StockQuantityGridRow[],
  allLocations: Location[]
): Location[] => {
  return allLocations.filter(
    (loc) =>
      !selectedLocations.find(
        (selected) => selected.location.id === loc.id && !selected.isNew
      )
  );
};

// warehouse related

export const isValidWarehouse = (
  warehouseToValidate: Partial<Location> | null
): boolean => {
  if (!warehouseToValidate) return false;
  return !!(
    warehouseToValidate.name &&
    warehouseToValidate.address
  )
}


// bundle related

export const isValidBundle = (
  bundleToValidate: Partial<Bundle> | null
): boolean => {
  if (!bundleToValidate) return false;
  return !!(
    bundleToValidate.name &&
    bundleToValidate.description &&
    bundleToValidate.bundleProduct
  );
};

export interface ProductGridRow extends Product {
  gridId: string;
  isNew?: boolean;
}

export const convertProductToGridRow = (
  product: Product[]
): ProductGridRow[] => {
  return product.map((pdt) => ({ ...pdt, gridId: randomId() }));
};

export const convertGridRowToProduct = (
  productGridRows: ProductGridRow[]
): Product[] => {
  return productGridRows.map((pdt) =>
    omit(pdt, ['gridId', 'isNew'])
  );
};

export const getAvailableProducts = (
  selectedProducts: ProductGridRow[],
  allProducts: Product[]
): Product[] => {
  return allProducts.filter(
    (pdt) =>
      !selectedProducts.find(
        (selected) => selected.id === pdt.id && !selected.isNew
      )
  );
};