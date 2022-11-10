/**
 * Used to make all API calls to supplier-related services
 */
import axios from 'axios';
import {
  Supplier,
  SupplierProduct,
  SupplierProductInfo
} from 'src/models/types';
//  import { NewSupplier } from 'src/pages/procurement/CreateSupplier';
import apiRoot from './util/apiRoot';

export const getAllSuppliers = async (): Promise<Supplier[]> => {
  return axios.get(`${apiRoot}/supplier/all`).then((res) => res.data);
};

export const getSupplierById = async (
  id: string | number
): Promise<Supplier> => {
  return axios.get(`${apiRoot}/supplier/${id}`).then((res) => res.data);
};

export const getAllSupplierProducts = async (): Promise<
  SupplierProductInfo[]
> => {
  return axios.get(`${apiRoot}/supplier/products/all`).then((res) => res.data);
};

export const createSupplier = async (supplier: Supplier): Promise<void> => {
  return axios.post(`${apiRoot}/supplier`, supplier);
};

export const updateSupplier = async (supplier: Supplier): Promise<void> => {
  return axios.put(`${apiRoot}/supplier`, supplier);
};

export const deleteSupplier = async (id: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/supplier/${id}`);
};

export const getAllCurrencies = async (): Promise<string[]> => {
  return axios
    .get(`${apiRoot}/supplier/currencies/all`)
    .then((res) => res.data);
};
