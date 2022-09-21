import { Reducer } from 'react';
import {
  SalesAction,
  SalesActionTypes,
  SalesStateAttr
} from './salesContextTypes';

const salesReducer: Reducer<SalesStateAttr, SalesAction> = (
  state: SalesStateAttr,
  action: SalesAction
): SalesStateAttr => {
  switch (action.type) {
    case SalesActionTypes.UPDATE_SALES_ORDERS:
      return { ...state, salesOrders: action.payload };
    default:
      return state;
  }
};

export default salesReducer;
