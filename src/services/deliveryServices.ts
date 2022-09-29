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

export const getManualDeliveryOrdersByRangeSvc = (
  dateRange: MomentRange
): Promise<DeliveryOrder[]> => {
  const reqBody = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format(),
    shippingType: 'MANUAL'
  };
  return axios
    .post(`${apiRoot}/delivery/timefilter/all`, reqBody)
    .then((res) => res.data);
};

export const getAllShippitDeliveries = async (): Promise<DeliveryOrder[]> => {
  return axios.get(`${apiRoot}/delivery/shippit/all`).then((res) => res.data);
};

export const getDeliveryOrderById = async (
  id: string | number
): Promise<DeliveryOrder> => {
  return axios.get(`${apiRoot}/delivery/${id}`).then((res) => res.data);
};

export const editDeliveryOrder = async (body: object): Promise<void> => {
  return axios.put(`${apiRoot}/delivery`, body);
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

export const getAllAssignedManualDeliveries = async (
  id: any
): Promise<DeliveryOrder[]> => {
  return axios.get(`${apiRoot}/delivery/deliveryAssignment/${id}`).then((res) => res.data);
};


export const getCurrentLocationLatLng = async (
  address: string | any
): Promise<any> => {
  return axios
    .post(`${apiRoot}/delivery/getCurrentLatLng`, address)
    .then((res) => res.data);
};

export const getAllUnassignedDeliveries = async (): Promise<DeliveryOrder[]> => {
  return axios.get(`${apiRoot}/delivery/unassigned/user`).then((res) => res.data);
};

export const getAllUnassignedDeliveriesPostalCodeByDate = (
  dateRange: MomentRange
): Promise<DeliveryOrder[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/delivery/unassigned/latlong`, timeFilter)
    .then((res) => res.data);
};
