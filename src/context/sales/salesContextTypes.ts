import { SalesOrder } from 'src/models/types';

export interface SalesStateAttr {
  salesOrders: SalesOrder[];
}

export interface SalesStateInit extends SalesStateAttr {
  refreshSalesOrder: (callback?: (salesOrders: SalesOrder[]) => void) => void;
}

export type SalesAction = {
  type: SalesActionTypes;
  payload?: any;
};

export enum SalesActionTypes {
  UPDATE_SALES_ORDERS = 'UPDATE_SALES_ORDERS'
}
