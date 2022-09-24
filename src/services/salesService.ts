import axios from 'axios';
import { SalesOrder } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllSalesOrderSvc = (): Promise<SalesOrder[]> => {
  return axios
    .get(`${apiRoot}/sales/all`)
    .then((res) => res.data);
};

export const getSalesOrderDetailsSvc = (id: string): Promise<SalesOrder> => {
  return axios.get(`${apiRoot}/sales/id/${id}`).then((res) => res.data);
};

export const completeOrderPrepSvc = (salesOrder: SalesOrder): Promise<any> => {
  console.log('salesOrder HEREEEEEE', salesOrder);
  return axios.put(`${apiRoot}/sales`, salesOrder).then((res) => res.data);
};

