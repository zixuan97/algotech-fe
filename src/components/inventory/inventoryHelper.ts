import { randomId } from '@mui/x-data-grid-generator';
import { omit } from 'lodash';
import { Product, StockQuantity, Location } from 'src/models/types';

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
