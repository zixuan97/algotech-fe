import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { OrderStatus } from 'src/models/types';

const DeliveryOrderStatusCell = ({ row }: GridRenderCellParams) => {
  const orderStatus = row.salesOrder.orderStatus;

  return orderStatus === OrderStatus.READY_FOR_DELIVERY ? (
    <Chip
      label='Delivery Scheduled'
      style={{ backgroundColor: '#E4F4D8', fontFamily: 'Poppins' }}
    />
  ) : orderStatus === OrderStatus.SHIPPED ? (
    <Chip
      label='Shipped'
      style={{
        backgroundColor: '#7FD083',
        fontFamily: 'Poppins',
        color: 'white'
      }}
    />
  ) : orderStatus === OrderStatus.DELIVERED ? (
    <Chip
      label='Completed'
      style={{
        backgroundColor: '#2E7D32',
        fontFamily: 'Poppins',
        color: 'white'
      }}
    />
  ) : (
    <Chip
      label='Cancelled'
      style={{ backgroundColor: '#D9D9D9', fontFamily: 'Poppins' }}
    />
  );
};

export default DeliveryOrderStatusCell;
