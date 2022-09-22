import {
  SalesOrder,
  PlatformType,
  OrderStatus,
  DeliveryStatus,
  ShippingType
} from 'src/models/types';

export const salesOrderData: Partial<SalesOrder>[] = [
  {
    orderId: '1',
    platformType: PlatformType.OTHERS,
    status: OrderStatus.PREPARED,
    createdTime: new Date(),
    customerName: 'Peter Tan',
    amount: 70,
    deliveryOrder: {
      id: 1,
      deliveryStatus: DeliveryStatus.READYFORDELIVERY,
      shippingDate: new Date(),
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
    orderId: '2',
    platformType: PlatformType.SHOPEE,
    status: OrderStatus.PREPARING,
    createdTime: new Date(),
    customerName: 'Alex Ong',
    amount: 30,
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
    orderId: '3',
    platformType: PlatformType.SHOPIFY,
    status: OrderStatus.SHIPPED,
    createdTime: new Date(),
    customerName: 'Sharon Tan',
    amount: 150,
    deliveryOrder: {
      id: 2,
      deliveryStatus: DeliveryStatus.DELIVERYINPROGRESS,
      shippingDate: new Date(),
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
];
