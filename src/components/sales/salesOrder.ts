import {
  SalesOrder,
  PlatformType,
  OrderStatus,
  DeliveryStatus,
  ShippingType
} from 'src/models/types';

export const salesOrderData: Partial<SalesOrder>[] = [
  {
    id: 1,
    platformType: PlatformType.MANUAL,
    status: OrderStatus.PREPARED,
    createdTime: new Date(),
    customerName: 'Peter Tan',
    amount: 70,
    delivery: {
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
        product: undefined
      },
      {
        saleOrderId: 1,
        price: 10,
        quantity: 5,
        product: undefined
      }
    ]
  },
  {
    id: 2,
    platformType: PlatformType.SHOPEE,
    status: OrderStatus.PREPARING,
    createdTime: new Date(),
    customerName: 'Alex Ong',
    amount: 30,
    delivery: undefined,
    salesOrderItems: [
      {
        saleOrderId: 2,
        price: 30,
        quantity: 1,
        product: undefined
      }
    ]
  },
  {
    id: 3,
    platformType: PlatformType.SHOPIFY,
    status: OrderStatus.SHIPPED,
    createdTime: new Date(),
    customerName: 'Sharon Tan',
    amount: 150,
    delivery: {
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
        product: undefined
      },
      {
        saleOrderId: 3,
        price: 15,
        quantity: 2,
        product: undefined
      }
    ]
  }
];
