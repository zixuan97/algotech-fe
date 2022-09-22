import axios from 'axios';
import { SalesOrder } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getSalesOrderSvc = (salesOrderId: string): Promise<SalesOrder> => {
  return axios
    .get(`${apiRoot}/sales/details/${salesOrderId}`)
    .then((res) => res.data);
};
