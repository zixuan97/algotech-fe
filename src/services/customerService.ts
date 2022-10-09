/**
 * Used to make all API calls to customer-related services
 */
 import axios from 'axios';
 import { Customer } from 'src/models/types';
 import { MomentRange } from 'src/utils/dateUtils';
 import apiRoot from './util/apiRoot';

 export const getAllCustomers = async (): Promise<Customer[]> => {
    return axios.get(`${apiRoot}/customer/all`).then((res) => res.data);
  };