import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';

const LalamoveDeliveryOrderStatusCell = ({ row }: GridRenderCellParams) => {
  const deliveryStatus = row.deliveryStatus.status;

  return deliveryStatus === 'ASSIGNING_DRIVER' ? (
    <Chip
      label='Assigning Driver'
      style={{ backgroundColor: '#FFDFCF', fontFamily: 'Poppins' }}
    />
  ) : deliveryStatus === 'ON_GOING' ? (
    <Chip
      label='Driver Assigned'
      style={{ backgroundColor: '#FFB48F', fontFamily: 'Poppins' }}
    />
  ) : deliveryStatus === 'PICKED_UP' ? (
    <Chip
      label='Delivery in Progress'
      style={{
        backgroundColor: '#FF6519',
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

export default LalamoveDeliveryOrderStatusCell;
