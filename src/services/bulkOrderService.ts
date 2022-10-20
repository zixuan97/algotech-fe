import { BulkOrder, BulkOrderStatus, OrderStatus } from 'src/models/types';
import axios from 'axios';
import apiRoot from './util/apiRoot';
import { MomentRange } from 'src/utils/dateUtils';

export const getAllBulkOrderSvc = async (): Promise<BulkOrder[]> => {
  return axios.get(`${apiRoot}/bulkOrder/all`).then((res) => res.data);
};

export const getBulkOrderByIdSvc = async (id: string): Promise<BulkOrder> => {
  return axios.get(`${apiRoot}/bulkOrder/id/${id}`).then((res) => res.data);
};

export const getBulkOrdersByRangeSvc = async (
  dateRange: MomentRange
): Promise<BulkOrder[]> => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  return axios
    .post(`${apiRoot}/sales/timefilter`, timeFilter)
    .then((res) => res.data);
};

export const bulkOrderMassUpdate = async (id: number, bulkOrderStatus: BulkOrderStatus, orderStatus: OrderStatus): Promise<any> => {
  return axios.put(`${apiRoot}/bulkOrder/salesOrderStatus`, {id, bulkOrderStatus, orderStatus}).then((res) => res.data);
};

export const updateBulkOrderStatusSvc = async (id: number, bulkOrderStatus: BulkOrderStatus): Promise<any> => {
  return axios.put(`${apiRoot}/bulkOrder/status`, {id, bulkOrderStatus}).then((res) => res.data);
};

export const updateBulkOrderSvc = async (bulkOrder: BulkOrder): Promise<BulkOrder> => {
  return axios.put(`${apiRoot}/bulkOrder`, bulkOrder).then((res) => res.data);
};