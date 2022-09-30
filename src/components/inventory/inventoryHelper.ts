import { randomId } from '@mui/x-data-grid-generator';
import { omit } from 'lodash';
import React from 'react';
import { Product, StockQuantity, Location, Bundle, BundleProduct } from 'src/models/types';
import { getProductById } from 'src/services/productService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';

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
        (selected) => selected.location!.id === loc.id && !selected.isNew
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

export const getAvailableStockQtyProducts = (
  selectedProducts: StockQuantityGridRow[],
  allProducts: Product[]
): Product[] => {
  return allProducts.filter(
    (pdt) =>
      !selectedProducts.find(
        (selected) => selected.productId === pdt.id && !selected.isNew
      )
  );
};

// bundle related

export const isValidBundle = (
  bundleToValidate: Partial<Bundle> | null
): boolean => {
  if (!bundleToValidate) return false;
  return !!(
    bundleToValidate.name &&
    bundleToValidate.description &&
    bundleToValidate.bundleProduct?.length
    // bundleToValidate.bundleProduct?.forEach((bundlePdt) => bundlePdt.quantity > 0)
  );
};

export interface BundleProductGridRow extends BundleProduct {
  gridId: string;
  isNew?: boolean;
}

export const convertBundleProductToGridRow = (
  bundleProduct: BundleProduct[]
): BundleProductGridRow[] => {
  // console.log("converted pdt to grid row");
  return bundleProduct.map((pdt) => ({ ...pdt, gridId: randomId()}));
};

export const convertGridRowToBundleProduct = (
  productGridRows: BundleProductGridRow[]
): BundleProduct[] => {
  // console.log("converted grid row to BP");
  return productGridRows.map((pdt) =>
    omit(pdt, ['gridId', 'isNew'])
  );
};

export const getAvailableProducts = (
  selectedProducts: BundleProductGridRow[],
  allProducts: Product[]
): Product[] => {
  return allProducts.filter(
    (pdt) =>
      !selectedProducts.find(
        (selected) => selected.productId === pdt.id && !selected.isNew
      )
  );
};