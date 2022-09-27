/**
 * Used to make all API calls to delivery-related services
 */
import axios from 'axios';
import { DeliveryOrder } from 'src/models/types';
import { MomentRange } from 'src/utils/dateUtils';
import apiRoot from './util/apiRoot';

export const getAllDeliveries = async (): Promise<DeliveryOrder[]> => {
  return axios.get(`${apiRoot}/delivery/all`).then((res) => res.data);
};

export const getAllShippitDeliveries = async (): Promise<DeliveryOrder[]> => {
  return axios
    .get(`${apiRoot}/delivery/shippit/orders/all`)
    .then((res) => res.data);
};

export const getDeliveryOrderById = async (
  id: string | number
): Promise<DeliveryOrder> => {
  return axios.get(`${apiRoot}/delivery/${id}`).then((res) => res.data);
};

//how do I get all postal codes of deliveries?
export const getAllDeliveriesPostalCode = async (): Promise<
  DeliveryOrder[]
> => {
  return axios.post(`${apiRoot}/delivery/latlong`).then((res) => res.data);
};

export const createDeliveryOrder = async (body: object): Promise<void> => {
  return axios.post(`${apiRoot}/delivery`, body);
};

export const getAllDeliveriesPostalCodeByDate = (
  dateRange: MomentRange
): Promise<DeliveryOrder[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/delivery/latlong`, timeFilter)
    .then((res) => res.data);
};
