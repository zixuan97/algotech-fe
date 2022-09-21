/**
 * Used to make all API calls to bundle-related services
 */
 import axios from 'axios';
 import { Bundle } from 'src/models/types';
 import apiRoot from './util/apiRoot';

 export const getAllBundles = async (): Promise<Bundle[]> => {
    return axios.get(`${apiRoot}/bundle/all`).then((res) => res.data);
  };
  
  export const getBundleById = async (id: string | number): Promise<Bundle> => {
    return axios.get(`${apiRoot}/bundle/${id}`).then((res) => res.data);
  };
  
  export const getBundleByName = async (name: string): Promise<Bundle> => {
    return axios.get(`${apiRoot}/bundle/name/${name}`).then((res) => res.data);
  };
  
  export const createBundle = async (bundle: Bundle): Promise<void> => {
    return axios.post(`${apiRoot}/bundle`, bundle);
  };
  
  export const updateBundle = async (bundle: Bundle): Promise<void> => {
    return axios.put(`${apiRoot}/bundle`, bundle);
  };
  
  export const deleteBundle = async (id: string | number): Promise<void> => {
    return axios.delete(`${apiRoot}/bundle/${id}`);
  };
  