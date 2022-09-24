/**
 * Used to make all API calls to delivery-related services
 */
import axios from 'axios';
import { DeliveryOrder } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllDeliveries = async (): Promise<DeliveryOrder[]> => {
  return axios.get(`${apiRoot}/delivery/all`).then((res) => res.data);
};

//how do I get all postal codes of deliveries?
export const getAllDeliveriesPostalCode = async (): Promise<DeliveryOrder[]> => {
  return axios.get(`${apiRoot}/delivery/all`).then((res) => res.data);
};

export const testing = async (postalCode : number): Promise<any> => {
  return axios.get(`https://developers.onemap.sg/commonapi/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=N&pageNum=1`).then((res) => res.data);

};
export const createDeliveryOrder = async (body: object): Promise<void> => {
  return axios.post(`${apiRoot}/delivery`, body);
};


