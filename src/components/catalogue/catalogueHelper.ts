import { randomId } from '@mui/x-data-grid-generator';
import { omit } from 'lodash';
import React from 'react';
import {
  Product,
  Bundle,
  ProductCatalogue,
  BundleCatalogue
} from 'src/models/types';
import { getProductById } from 'src/services/productService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';

export const isValidProductCatalogue = (
  productCatalogueToValidate: Partial<ProductCatalogue> | null
): boolean => {
  if (!productCatalogueToValidate) return false;
  return !!(
    productCatalogueToValidate.product && productCatalogueToValidate.price
  );
};

export const isValidBundleCatalogue = (
  bundleCatalogueToValidate: Partial<BundleCatalogue> | null
): boolean => {
  if (!bundleCatalogueToValidate) return false;
  return !!(
    bundleCatalogueToValidate.bundle && bundleCatalogueToValidate.price
  );
};
