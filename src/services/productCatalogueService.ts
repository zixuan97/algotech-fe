import axios from 'axios';
import { ProductCatalogue } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllProductCatalogues = async (): Promise<
  ProductCatalogue[]
> => {
  return axios.get(`${apiRoot}/productcatalogue/all`).then((res) => res.data);
};

export const getProductCatalogueById = async (
  id: string | number
): Promise<ProductCatalogue> => {
  return axios
    .get(`${apiRoot}/productcatalogue/id/${id}`)
    .then((res) => res.data);
};

export const createProductCatalogue = async (
  formData: FormData
): Promise<void> => {
  return axios.post(`${apiRoot}/productcatalogue`, formData);
};

export const updateProductCatalogue = async (
  formData: FormData
): Promise<void> => {
  return axios.put(`${apiRoot}/productcatalogue`, formData);
};

export const deleteProductCatalogue = async (
  id: string | number
): Promise<void> => {
  return axios.delete(`${apiRoot}/productcatalogue/${id}`);
};
