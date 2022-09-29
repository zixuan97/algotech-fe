import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { OrderStatus } from 'src/models/types';

const DeliveryOrderStatusCell = ({ row }: GridRenderCellParams) => {
  const orderStatus = row.salesOrder.orderStatus;

  return orderStatus === OrderStatus.READY_FOR_DELIVERY ? (
    <Chip
      label='Delivery Scheduled'
      style={{ backgroundColor: '#0096ff', fontFamily: 'Poppins' }}
    />
  ) : orderStatus === OrderStatus.SHIPPED ? (
    <Chip
      label='Shipped'
      style={{ backgroundColor: '#FB8832', fontFamily: 'Poppins' }}
    />
  ) : (
    <Chip
      label='Completed'
      style={{ backgroundColor: '#0d6e11', fontFamily: 'Poppins' }}
    />
  );
};

export default DeliveryOrderStatusCell;
