/**
 * Used to make all API calls to product-related services
 */
import axios from 'axios';
import { Brand } from 'src/models/types';
import { NewBrand } from 'src/pages/inventory/CreateBrand';
import apiRoot from './util/apiRoot';

export const getAllBrands = async (): Promise<Brand[]> => {
  return axios.get(`${apiRoot}/brand/all`).then((res) => res.data);
};

export const getBrandById = async (id: string | number): Promise<Brand> => {
  return axios.get(`${apiRoot}/brand/${id}`).then((res) => res.data);
};

export const createBrand = async (brand: NewBrand): Promise<void> => {
  return axios.post(`${apiRoot}/brand`, brand);
};
export const updateBrand = async (brand: Brand): Promise<void> => {
  return axios.put(`${apiRoot}/brand`, brand);
};

export const deleteBrand = async (id: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/brand/${id}`);
};
