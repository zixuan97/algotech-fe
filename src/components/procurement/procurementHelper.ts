import { randomId } from '@mui/x-data-grid-generator';
import { omit } from 'lodash';
import { Supplier, SupplierProduct, Product } from 'src/models/types';

// supplier related
export interface SupplierProductGridRow extends SupplierProduct {
  gridId: string;
  isNew?: boolean;
}

export const isValidSupplier = (
  supplierToValidate: Partial<Supplier> | null
): boolean => {
  if (!supplierToValidate) return false;
  return !!(
    (
      supplierToValidate.name &&
      supplierToValidate.email &&
      supplierToValidate.address &&
      supplierToValidate.currency
    )
    // supplierToValidate.supplierProduct?.length
  );
};

export interface SupplierProductGridRow extends SupplierProduct {
  gridId: string;
  isNew?: boolean;
}

export const convertSupplierProductToGridRow = (
  supplierProduct: SupplierProduct[]
): SupplierProductGridRow[] => {
  return supplierProduct.map((pdt) => ({ ...pdt, gridId: randomId() }));
};

export const convertGridRowToSupplierProduct = (
  productGridRows: SupplierProductGridRow[]
): SupplierProduct[] => {
  return productGridRows.map((pdt) => omit(pdt, ['gridId', 'isNew']));
};

export const getAvailableProducts = (
  selectedProducts: SupplierProductGridRow[],
  allProducts: Product[]
): Product[] => {
  return allProducts.filter(
    (pdt) =>
      !selectedProducts.find(
        (selected) => selected.product.id === pdt.id && !selected.isNew
      )
  );
};
