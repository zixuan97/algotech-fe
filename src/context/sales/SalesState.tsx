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
        orderStatus: OrderStatus.PREPARED,
        createdTime: new Date(),
        customerName: 'Peter Tan',
        amount: 70,
        customerContactNo: '99998888',
        currency: 'SGD',
        customerAddress: 'Blk 789 NUS Road #03-02',
        customerEmail: 'ghi@xyz.com',
        postalCode: '789456',
        deliveryOrder: {
          id: 1,
          deliveryStatus: DeliveryStatus.READYFORDELIVERY,
          shippingDate: new Date(),
          shippingType: ShippingType.MANUAL,
          currentLocation: 'Blk 100 NUS Road #01-01',
          eta: new Date(),
          salesOrderId: 1
        },
        salesOrderItems: [
          {
            id: 1,
            salesOrderId: 1,
            price: 20,
            quantity: 1,
            productName: 'Pork Floss Popcorn'
          },
          {
            id: 2,
            salesOrderId: 1,
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
        orderStatus: OrderStatus.PAID,
        createdTime: new Date(),
        customerName: 'Alex Ong',
        amount: 30,
        customerContactNo: '99998888',
        currency: 'SGD',
        customerAddress: 'Blk 123 NUS Road #09-02',
        customerEmail: 'def@xyz.com',
        postalCode: '654321',
        deliveryOrder: undefined,
        salesOrderItems: [
          {
            id: 3,
            salesOrderId: 2,
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
        orderStatus: OrderStatus.SHIPPED,
        createdTime: new Date(),
        customerName: 'Sharon Tan',
        amount: 150,
        customerContactNo: '99998888',
        currency: 'SGD',
        customerAddress: 'Blk 456 NUS Road #01-01',
        customerEmail: 'abc@xyz.com',
        postalCode: '123456',
        deliveryOrder: {
          id: 2,
          deliveryStatus: DeliveryStatus.DELIVERYINPROGRESS,
          shippingDate: new Date(),
          shippingType: ShippingType.MANUAL,
          currentLocation: 'Blk 400 NUS Road #01-01',
          eta: new Date(),
          salesOrderId: 3,
        },
        salesOrderItems: [
          {
            id: 4,
            salesOrderId: 3,
            price: 60,
            quantity: 2,
            productName: 'Nasi Lemak Popcorn'
          },
          {
            id: 5,
            salesOrderId: 3,
            price: 15,
            quantity: 2,
            productName: 'Pulut Hitam Popcorn'
          },
          {
            id: 6,
            salesOrderId: 4,
            price: 10,
            quantity: 2,
            productName: 'Pork Cutlet Popcorn'
          }
        ]
      },
      {
        id: 4,
        orderId: '4',
        platformType: PlatformType.SHOPIFY,
        orderStatus: OrderStatus.COMPLETED,
        createdTime: new Date(),
        customerName: 'Tony Quek',
        amount: 290,
        customerContactNo: '66667777',
        currency: 'SGD',
        customerAddress: 'Blk 147 NUS Road #14-63',
        customerEmail: 'jkl@efg.com',
        postalCode: '123654',
        deliveryOrder: {
          id: 2,
          deliveryStatus: DeliveryStatus.DELIVERYINPROGRESS,
          shippingDate: new Date(),
          shippingType: ShippingType.MANUAL,
          currentLocation: 'Blk 400 NUS Road #01-01',
          eta: new Date(),
          salesOrderId: 4
        },
        salesOrderItems: [
          {
            id: 7,
            salesOrderId: 4,
            price: 60,
            quantity: 4,
            productName: 'Nasi Lemak Popcorn'
          },
          {
            id: 8,
            salesOrderId: 4,
            price: 15,
            quantity: 2,
            productName: 'Pulut Hitam Popcorn'
          },
          {
            id: 9,
            salesOrderId: 4,
            price: 10,
            quantity: 2,
            productName: 'Pork Cutlet Popcorn'
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