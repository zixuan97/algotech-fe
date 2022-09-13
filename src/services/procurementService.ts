/**
 * Used to make all API calls to procurement-related services
 */
import axios from 'axios';
import { ProcurementOrder } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllProcurementOrders = async (): Promise<
  ProcurementOrder[]
> => {
  return axios.get(`${apiRoot}/procurement/all`).then((res) => res.data);
};
