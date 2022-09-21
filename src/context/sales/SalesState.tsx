import React, { PropsWithChildren } from 'react';
import { SalesActionTypes, SalesStateAttr } from './salesContextTypes';
import InventoryContext from './salesContext';
import salesReducer from './salesReducer';
import { SalesOrder } from 'src/models/types';

const SalesState = (props: PropsWithChildren) => {
  const initialState: SalesStateAttr = {
    salesOrders: []
  };

  const [state, dispatch] = React.useReducer(salesReducer, initialState);

  // TODO: replace with actual API call
  // note: also can add mock data here for testing
  const updateSalesOrders = (
    callback?: (salesOrders: SalesOrder[]) => void
  ) => {
    callback?.([]);
    dispatch({
      type: SalesActionTypes.UPDATE_SALES_ORDERS,
      payload: []
    });
  };

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
