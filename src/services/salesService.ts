import axios from 'axios';
import {
  DailySales,
  OrderStatus,
  SalesBestseller,
  SalesOrder,
  SalesRevenue
} from 'src/models/types';
import { MomentRange } from 'src/utils/dateUtils';
import apiRoot from './util/apiRoot';

export const getSalesOrderDetailsSvc = (
  salesOrderId: string
): Promise<SalesOrder> => {
  return axios
    .get(`${apiRoot}/sales/id/${salesOrderId}`)
    .then((res) => res.data);
};

export const getAllSalesOrderSvc = (): Promise<SalesOrder[]> => {
  return axios.get(`${apiRoot}/sales/all`).then((res) => res.data);
};

export const getSalesOrdersByRangeSvc = (
  dateRange: MomentRange
): Promise<SalesOrder[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/sales/timefilter`, timeFilter)
    .then((res) => res.data);
};

export const getDailySalesByRangeSvc = (
  dateRange: MomentRange
): Promise<DailySales[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/sales/timefilterbyday/orders`, timeFilter)
    .then((res) => res.data);
};

export const getSalesRevenueByRangeSvc = (
  dateRange: MomentRange
): Promise<SalesRevenue[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/sales/timefilterbyday/revenue`, timeFilter)
    .then((res) => res.data);
};

export const getSalesBestsellersByRangeSvc = (
  dateRange: MomentRange
): Promise<SalesBestseller[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/sales/timefilterbyday/bestseller`, timeFilter)
    .then((res) => res.data);
};

export const completeOrderPrepSvc = (salesOrder: SalesOrder): Promise<any> => {
  return axios.put(`${apiRoot}/sales`, salesOrder).then((res) => res.data);
};

export const updateSalesOrderStatusSvc = (id: string, orderStatus: OrderStatus): Promise<any> => {
  return axios.put(`${apiRoot}/sales`, {id, orderStatus}).then((res) => res.data);
};
