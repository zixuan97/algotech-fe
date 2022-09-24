import React, { PropsWithChildren } from 'react';
import { SalesActionTypes, SalesStateAttr } from './salesContextTypes';
import InventoryContext from './salesContext';
import salesReducer from './salesReducer';
import {
  DeliveryStatus,
  OrderStatus,
  PlatformType,
  SalesOrder,
  ShippingType
} from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllSalesOrderSvc } from 'src/services/salesService';

const SalesState = (props: PropsWithChildren) => {
  const initialState: SalesStateAttr = {
    salesOrders: []
  };

  const [state, dispatch] = React.useReducer(salesReducer, initialState);

  // TODO: replace with actual API call
  // note: also can add mock data here for testing
  const updateSalesOrders = (callback?: (salesOrders: SalesOrder[]) => void) =>
    asyncFetchCallback(getAllSalesOrderSvc(), (res) => {
      callback?.(res);
      dispatch({ type: SalesActionTypes.UPDATE_SALES_ORDERS, payload: res });
    });

  return (
    <InventoryContext.Provider
      value={{
        ...state,
        refreshSalesOrder: updateSalesOrders
      }}
    >
      {props.children}
    </InventoryContext.Provider>
  );
};

export default SalesState;
