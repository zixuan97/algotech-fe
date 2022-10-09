import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';

const ShippitDeliveryOrderStatusCell = ({ row }: GridRenderCellParams) => {
  const deliveryStatus = row.deliveryStatus.status;

  return deliveryStatus === 'order_placed' ? (
    <Chip
      label='Order Placed'
      style={{ backgroundColor: '#E2D8F5', fontFamily: 'Poppins' }}
    />
  ) : deliveryStatus === 'despatch_in_progress' ? (
    <Chip
      label='Packing Order'
      style={{ backgroundColor: '#B99FEE', fontFamily: 'Poppins' }}
    />
  ) : deliveryStatus === 'ready_for_pickup' ? (
    <Chip
      label='Booked for Delivery'
      style={{
        backgroundColor: '#7F4FDF',
        fontFamily: 'Poppins',
        color: 'white'
      }}
    />
  ) : deliveryStatus === 'untrackable' ? (
    <Chip
      label='Out for Delivery'
      style={{
        backgroundColor: '#6322E5',
        fontFamily: 'Poppins',
        color: 'white'
      }}
    />
  ) : (
    <Chip
      label='Cancelled'
      style={{
        backgroundColor: '#D9D9D9',
        fontFamily: 'Poppins'
      }}
    />
  );
};

export default ShippitDeliveryOrderStatusCell;
