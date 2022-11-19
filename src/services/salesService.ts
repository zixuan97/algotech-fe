import axios from 'axios';
import {
  DailySales,
  DeliveryOrder,
  OrderStatus,
  ProductSalesQty,
  SalesBestseller,
  SalesOrder,
  SalesRevenue
} from 'src/models/types';
import { MomentRange } from 'src/utils/dateUtils';
import apiRoot from './util/apiRoot';

export const getSalesOrderDetailsSvc = async (
  id: string
): Promise<SalesOrder> => {
  return axios.get(`${apiRoot}/sales/id/${id}`).then((res) => res.data);
};

export const getSalesOrderDetailsByOrderIdSvc = async (
  salesOrderId: string
): Promise<SalesOrder> => {
  return axios
    .get(`${apiRoot}/sales/orderid/${salesOrderId}`)
    .then((res) => res.data);
};

export const getAllSalesOrderSvc = async (): Promise<SalesOrder[]> => {
  return axios.get(`${apiRoot}/sales/all`).then((res) => res.data);
};

export const getSalesOrdersByRangeSvc = async (
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

export const getDailySalesByRangeSvc = async (
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

export const getSalesRevenueByRangeSvc = async (
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

export const getSalesBestsellersByRangeSvc = async (
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

export const getAverageOrderNumSvc = async (
  dateRange: MomentRange
): Promise<number> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/sales/timefilterbyday/average/orders`, timeFilter)
    .then((res) => res.data);
};

export const getAverageOrderValueSvc = async (
  dateRange: MomentRange
): Promise<number> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/sales/timefilterbyday/average/value/orders`, timeFilter)
    .then((res) => res.data);
};

export const getAllProductSalesByRangeSvc = async (
  dateRange: MomentRange,
): Promise<SalesBestseller[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/sales/timefilterbyday/items/bestseller`, timeFilter)
    .then((res) => res.data);
};

export const getProductSalesByRangeSvc = async (
  dateRange: MomentRange,
  productName: string
): Promise<ProductSalesQty[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format(),
    productName: productName
  };

  return axios
    .post(`${apiRoot}/sales/timefilterbyday/products`, timeFilter)
    .then((res) => res.data);
};

export const completeOrderPrepSvc = async (
  salesOrder: SalesOrder
): Promise<any> => {
  return axios.put(`${apiRoot}/sales`, salesOrder).then((res) => res.data);
};

export const updateSalesOrderStatusSvc = async (
  id: number,
  orderStatus: OrderStatus
): Promise<any> => {
  return axios
    .put(`${apiRoot}/sales/status`, { id, orderStatus })
    .then((res) => res.data);
};

export const getDeliveryTypeSvc = async (
  salesOrderId: number
): Promise<DeliveryOrder> => {
  return axios
    .get(`${apiRoot}/delivery/sales/${salesOrderId}`)
    .then((res) => res.data);
};
