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

export const create = async (product: Product): Promise<void> => {
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

export const getCategoryById = async (id: string | number): Promise<Category> => {
  return axios.get(`${apiRoot}/category/${id}`).then((res) => res.data);
};

export const createCategory = async (category: Category): Promise<void> => {
  return axios.post(`${apiRoot}/category`, category);
};
export const updateCategory = async (category: Category): Promise<void> => {
  return axios.put(`${apiRoot}/category`, category);
};

export const deleteCategory = async (id: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/category/${id}`);
};


//brands
export const getAllBrands = async(): Promise<Brand[]> => {
  return axios.get(`${apiRoot}/brand/all`).then((res) => res.data);
}

export const getBrandById = async (id: string | number): Promise<Brand> => {
  return axios.get(`${apiRoot}/brand/${id}`).then((res) => res.data);
};

export const createBrand = async (brand: Brand): Promise<void> => {
  return axios.post(`${apiRoot}/brand`, brand);
};
export const updateBrand = async (brand: Brand): Promise<void> => {
  return axios.put(`${apiRoot}/brand`, brand);
};

export const deleteBrand = async (id: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/brand/${id}`);
};