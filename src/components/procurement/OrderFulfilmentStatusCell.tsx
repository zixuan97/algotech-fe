import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { ProcurementOrder } from 'src/models/types';

const OrderFulfilmentStatusCell = ({ row }: GridRenderCellParams) => {
  const { fulfilment_status } = row as ProcurementOrder;
  return fulfilment_status === 'CREATED' ? (
    <Chip
      label='In Progress'
      style={{ backgroundColor: '#FBCF32', fontFamily: 'Poppins' }}
    />
  ) : fulfilment_status === 'COMPLETED' ? (
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
