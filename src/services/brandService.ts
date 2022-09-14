/**
 * Used to make all API calls to product-related services
 */
import axios from 'axios';
import apiRoot from './util/apiRoot';

export const getAllBrands = async () => {
  return axios.get(`${apiRoot}/brand/all`).then((res) => res.data);
};
