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

const SalesState = (props: PropsWithChildren) => {
  const initialState: SalesStateAttr = {
    salesOrders: [
      {
        id: 1,
        orderId: '1',
        platformType: PlatformType.OTHERS,
        status: OrderStatus.PREPARED,
        createdTime: new Date(),
        customerName: 'Peter Tan',
        amount: 70,
        customerContactNo: '99998888',
        currency: 'SGD',
        deliveryOrder: {
          id: 1,
          deliveryStatus: DeliveryStatus.READYFORDELIVERY,
          shippingDate: new Date(),
          shippingAddress: 'Blk 123 NUS Road #01-01',
          shippingType: ShippingType.MANUAL,
          currentLocation: 'Blk 100 NUS Road #01-01',
          eta: new Date()
        },
        salesOrderItems: [
          {
            saleOrderId: 1,
            price: 20,
            quantity: 1,
            productName: 'Pork Floss Popcorn'
          },
          {
            saleOrderId: 1,
            price: 10,
            quantity: 5,
            productName: 'Chicken Floss Popcorn'
          }
        ]
      },
      {
        id: 2,
        orderId: '2',
        platformType: PlatformType.SHOPEE,
        status: OrderStatus.PREPARING,
        createdTime: new Date(),
        customerName: 'Alex Ong',
        amount: 30,
        customerContactNo: '99998888',
        currency: 'SGD',
        deliveryOrder: undefined,
        salesOrderItems: [
          {
            saleOrderId: 2,
            price: 30,
            quantity: 1,
            productName: 'Caramel Popcorn'
          }
        ]
      },
      {
        id: 3,
        orderId: '3',
        platformType: PlatformType.SHOPIFY,
        status: OrderStatus.SHIPPED,
        createdTime: new Date(),
        customerName: 'Sharon Tan',
        amount: 150,
        customerContactNo: '99998888',
        currency: 'SGD',
        deliveryOrder: {
          id: 2,
          deliveryStatus: DeliveryStatus.DELIVERYINPROGRESS,
          shippingDate: new Date(),
          shippingAddress: 'Blk 456 NUS Road #01-01',
          shippingType: ShippingType.MANUAL,
          currentLocation: 'Blk 400 NUS Road #01-01',
          eta: new Date()
        },
        salesOrderItems: [
          {
            saleOrderId: 3,
            price: 60,
            quantity: 2,
            productName: 'Nasi Lemak Popcorn'
          },
          {
            saleOrderId: 3,
            price: 15,
            quantity: 2,
            productName: 'Pulut Hitam Popcorn'
          }
        ]
      }
    ]
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
