import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { FulfilmentStatus, ProcurementOrder } from 'src/models/types';

const OrderFulfilmentStatusCell = ({ row }: GridRenderCellParams) => {
  const { fulfilmentStatus } = row as ProcurementOrder;
  return fulfilmentStatus === FulfilmentStatus.CREATED ? (
    <Chip
      label='Created'
      style={{ backgroundColor: '#FBCF32', fontFamily: 'Poppins' }}
    />
  ) : fulfilmentStatus === FulfilmentStatus.COMPLETED ? (
    <Chip
      label='Completed'
      style={{ backgroundColor: '#4AAF05', fontFamily: 'Poppins' }}
    />
  ) : (
    <Chip
      label='Arrived'
      style={{ backgroundColor: '#FB8832', fontFamily: 'Poppins' }}
    />
  );
};

export default OrderFulfilmentStatusCell;
