import axios from 'axios';
import { BundleCatalogue } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllBundleCatalogues = async (): Promise<BundleCatalogue[]> => {
  return axios.get(`${apiRoot}/bundlecatalogue/all`).then((res) => res.data);
};

export const getBundleCatalogueById = async (
  id: string | number
): Promise<BundleCatalogue> => {
  return axios
    .get(`${apiRoot}/bundlecatalogue/id/${id}`)
    .then((res) => res.data);
};

export const createBundleCatalogue = async (
  formData: FormData
): Promise<void> => {
  return axios.post(`${apiRoot}/bundlecatalogue`, formData);
};

export const updateBundleCatalogue = async (
  formData: FormData
): Promise<void> => {
  return axios.put(`${apiRoot}/bundlecatalogue`, formData);
};

export const deleteBundleCatalogue = async (
  id: string | number
): Promise<void> => {
  return axios.delete(`${apiRoot}/bundlecatalogue/${id}`);
};
