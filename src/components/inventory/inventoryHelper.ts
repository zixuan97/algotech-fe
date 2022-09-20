import { Product } from 'src/models/types';

export const isValidProduct = (
  productToValidate: Partial<Product>
): boolean => {
  return !!(
    productToValidate.sku &&
    productToValidate.name &&
    productToValidate.brand &&
    productToValidate.qtyThreshold
  );
};
