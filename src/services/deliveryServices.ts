/**
 * Used to make all API calls to delivery-related services
 */
import axios from 'axios';
import { DeliveryOrder } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllDeliveries = async (): Promise<DeliveryOrder[]> => {
  return axios.get(`${apiRoot}/delivery/all`).then((res) => res.data);
};
