/**
 * Used to make all API calls to product-related services
 */
import axios from 'axios';
import { Category, Product, Brand } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllProducts = async (): Promise<Product[]> => {
  return axios.get(`${apiRoot}/product/all`).then((res) => res.data);
};

export const getProductById = async (id: string | number): Promise<Product> => {
  return axios.get(`${apiRoot}/product/${id}`).then((res) => res.data);
};

export const getProductBySku = async (sku: string): Promise<Product> => {
  return axios.get(`${apiRoot}/product/sku/${sku}`).then((res) => res.data);
};

export const createProduct = async (product: Product): Promise<void> => {
  return axios.post(`${apiRoot}/product`, product);
};

export const updateProduct = async (product: Product): Promise<void> => {
  return axios.put(`${apiRoot}/product`, product);
};

export const deleteProduct = async (id: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/product/${id}`);
};

//categories
export const getAllProductCategories = async (): Promise<Category[]> => {
  return axios.get(`${apiRoot}/category/all`).then((res) => res.data);
};

//Returns a blob
export const generateExcelSvc = async (): Promise<any> => {
  return axios
    .post(`${apiRoot}/product/excel`, { responseType: 'blob' })
    .then((res) => res.data);
};

export const getAllProductsByBrand = async (
  brandId: string | number
): Promise<Product[]> => {
  return axios.get(`${apiRoot}/product/all`).then((res) => res.data);
};

export const getAllProductsByCategory = async (
  categoryId: string | number
): Promise<Product[]> => {
  return axios.get(`${apiRoot}/product/all`).then((res) => res.data);
};

export const getAllProductsByLocation = async (
  locationId: string | number
): Promise<Product[]> => {
  return axios.get(`${apiRoot}/product/all`).then((res) => res.data);
};
