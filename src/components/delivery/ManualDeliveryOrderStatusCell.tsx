import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { OrderStatus } from 'src/models/types';

const ManualDeliveryOrderStatusCell = ({ row }: GridRenderCellParams) => {
  const orderStatus = row.salesOrder.orderStatus;
  const deliveryStatus = row.deliveryStatus?.status;

  return deliveryStatus === 'cancelled' ? (
    <Chip
      label='Cancelled'
      style={{ backgroundColor: '#D9D9D9', fontFamily: 'Poppins' }}
    />
  ) : orderStatus === OrderStatus.READY_FOR_DELIVERY ? (
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
  ) : (
    <Chip
      label='Completed'
      style={{
        backgroundColor: '#2E7D32',
        fontFamily: 'Poppins',
        color: 'white'
      }}
    />
  );
};

export default ManualDeliveryOrderStatusCell;
