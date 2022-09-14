/**
 * Used to make all API calls to product-related services
 */
import axios from 'axios';
import { Category } from 'src/models/types';
import { NewCategory } from 'src/pages/inventory/CreateCategory';
import apiRoot from './util/apiRoot';
 
export const getAllProductCategories = async (): Promise<Category[]> => {
  return axios.get(`${apiRoot}/category/all`).then((res) => res.data);
};

export const getCategoryById = async (
  id: string | number
): Promise<Category> => {
  return axios.get(`${apiRoot}/category/${id}`).then((res) => res.data);
};

export const createCategory = async (category: NewCategory): Promise<void> => {
  return axios.post(`${apiRoot}/category`, category);
};

export const updateCategory = async (category: Category): Promise<void> => {
  return axios.put(`${apiRoot}/category`, category);
};

export const deleteCategory = async (id: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/category/${id}`);
};