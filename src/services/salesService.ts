import axios from 'axios';
import { OrderStatus, SalesOrder } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllSalesOrderSvc = (): Promise<SalesOrder[]> => {
  return axios.get(`${apiRoot}/sales/all`).then((res) => res.data);
};

export const getAllSalesOrderWithTimeSvc = (
  time_from: string,
  time_to: string
): Promise<SalesOrder[]> => {
  return axios
    .post(`${apiRoot}/sales/timefilter`, { time_from, time_to })
    .then((res) => res.data);
};

export const getSalesOrderDetailsSvc = (id: string): Promise<SalesOrder> => {
  return axios.get(`${apiRoot}/sales/id/${id}`).then((res) => res.data);
};

export const completeOrderPrepSvc = (salesOrder: SalesOrder): Promise<any> => {
  return axios.put(`${apiRoot}/sales`, salesOrder).then((res) => res.data);
};

export const updateSalesOrderStatusSvc = (
  id: string,
  orderStatus: OrderStatus
): Promise<any> => {
  return axios
    .put(`${apiRoot}/sales/status`, { id, orderStatus })
    .then((res) => res.data);
};
