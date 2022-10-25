/**
 * Used to make all API calls to delivery-related services
 */
import axios from 'axios';
import { DeliveryOrder, LalamoveDriver } from 'src/models/types';
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

export const cancelManualDelivery = async (
  id: string | number
): Promise<void> => {
  return axios.post(`${apiRoot}/delivery/cancelManual/${id}`);
};

export const getShippitDeliveryOrdersByRangeSvc = (
  dateRange: MomentRange
): Promise<DeliveryOrder[]> => {
  const reqBody = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/delivery/shippitDeliveries/date`, reqBody)
    .then((res) => res.data);
};

export const getAllShippitDeliveries = async (): Promise<DeliveryOrder[]> => {
  return axios.get(`${apiRoot}/delivery/shippit/all`).then((res) => res.data);
};

export const trackShippitDeliveryOrder = async (
  trackingNum: string
): Promise<Object> => {
  return axios
    .get(`${apiRoot}/delivery/shippit/${trackingNum}`)
    .then((res) => res.data);
};

export const confirmShippitOrder = async (
  trackingNum: string
): Promise<void> => {
  return axios.post(`${apiRoot}/delivery/shippit/confirm/${trackingNum}`);
};

export const bookShippitDelivery = async (
  trackingNum: string
): Promise<void> => {
  return axios.post(`${apiRoot}/delivery/shippit/book/${trackingNum}`);
};

export const getShippitLabel = async (trackingNum: string): Promise<string> => {
  return axios
    .get(`${apiRoot}/delivery/shippit/label/${trackingNum}`)
    .then((res) => res.data);
};

export const getShippitBookingLabel = async (
  trackingNum: string
): Promise<string> => {
  return axios
    .post(`${apiRoot}/delivery/bookinglabel/${trackingNum}`)
    .then((res) => res.data);
};

export const getDeliveryOrderById = async (
  id: string | number
): Promise<DeliveryOrder> => {
  return axios.get(`${apiRoot}/delivery/${id}`).then((res) => res.data);
};

export const getDeliveryOrderByTracking = async (
  trackingNum: string
): Promise<DeliveryOrder> => {
  return axios
    .get(`${apiRoot}/delivery/track/${trackingNum}`)
    .then((res) => res.data);
};

export const editDeliveryOrder = async (body: object): Promise<void> => {
  return axios.put(`${apiRoot}/delivery`, body);
};

export const cancelShippitDelivery = async (
  trackingNum: string
): Promise<void> => {
  return axios.post(`${apiRoot}/delivery/cancel/${trackingNum}`);
};

export const createManualDeliveryOrder = async (
  body: object
): Promise<void> => {
  return axios.post(`${apiRoot}/delivery/manual`, body);
};

export const createShippitDeliveryOrder = async (
  body: object
): Promise<void> => {
  return axios.post(`${apiRoot}/delivery/shippit`, body);
};

export const createLalamoveDeliveryOrder = async (
  body: object
): Promise<void> => {
  return axios.post(`${apiRoot}/delivery/lalamove`, body);
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
  return axios
    .post(`${apiRoot}/delivery/deliveryAssignment/${id}`)
    .then((res) => res.data);
};

export const getAllAssignedDeliveriesByDate = async (
  dateRange: MomentRange,
  id: number | any
): Promise<DeliveryOrder[]> => {
  const resBody = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format(),
    assignedUserId: id
  };
  console.log(resBody);
  return axios
    .post(`${apiRoot}/delivery/byUser/assignedByDate`, resBody)
    .then((res) => res.data);
};

export const getCurrentLocationLatLng = async (
  address: string | any
): Promise<any> => {
  return axios
    .post(`${apiRoot}/delivery/getCurrentLatLng`, address)
    .then((res) => res.data);
};

export const getAllUnassignedDeliveries = async (
  dateRange: MomentRange
): Promise<DeliveryOrder[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  // console.log(timeFilter)
  return axios
    .post(`${apiRoot}/delivery/unassignedByDate`, timeFilter)
    .then((res) => res.data);
};

export const getAllUnassignedDeliveriesPostalCodeByDate = (
  dateRange: MomentRange
): Promise<DeliveryOrder[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/delivery/latlong/unassigned`, timeFilter)
    .then((res) => res.data);
};

export const getAllAssignedDeliveriesPostalCodeByDate = (
  dateRange: MomentRange,
  id: number | any
): Promise<DeliveryOrder[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format(),
    id: id
  };
  return axios
    .post(`${apiRoot}/delivery/latlong/assigned`, timeFilter)
    .then((res) => res.data);
};

export const getLalamoveDeliveryOrdersByRangeSvc = (
  dateRange: MomentRange
): Promise<DeliveryOrder[]> => {
  const reqBody = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/delivery/lalamoveDeliveries/date`, reqBody)
    .then((res) => res.data);
};

export const getLalamoveDeliveryOrderById = async (
  id: string | number
): Promise<DeliveryOrder> => {
  return axios
    .get(`${apiRoot}/delivery/lalamove/${id}`)
    .then((res) => res.data);
};

export const getLalamoveDeliveryOrderByLalamoveId = async (
  lalamoveId: string | number
): Promise<string> => {
  return axios
    .get(`${apiRoot}/delivery/lalamove/track/${lalamoveId}`)
    .then((res) => res.data);
};

export const getLalamoveDriverDetailsById = async (
  id: string | number
): Promise<LalamoveDriver> => {
  return axios
    .get(`${apiRoot}/delivery/lalamove/driver/${id}`)
    .then((res) => res.data);
};

export const cancelLalamoveDelivery = async (
  id: string | number
): Promise<void> => {
  return axios.post(`${apiRoot}/delivery/lalamove/cancel/${id}`);
};
