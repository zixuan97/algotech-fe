import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { BulkOrderStatus } from 'src/models/types';

const BulkOrderStatusCell = ({ row }: GridRenderCellParams) => {
  const orderStatus = row.bulkOrderStatus;

  return orderStatus === BulkOrderStatus.CREATED ? (
    <Chip
      label='Created'
      style={{ backgroundColor: '#E4F4D8', fontFamily: 'Poppins' }}
    />
  ) : orderStatus === BulkOrderStatus.CANCELLED ? (
    <Chip
      label='Cancelled'
      style={{ backgroundColor: '#D9D9D9', fontFamily: 'Poppins' }}
    />
  ) : orderStatus === BulkOrderStatus.FULFILLED? (
    <Chip
      label='Fulfilled'
      style={{ backgroundColor: '#2E7D32', fontFamily: 'Poppins' }}
    />
  ) : orderStatus === BulkOrderStatus.PAYMENT_FAILED ? (
    <Chip
      label='Payment Failed'
      style={{ backgroundColor: '#F49A93', fontFamily: 'Poppins' }}
    />
  ) : (
    <Chip
      label='Payment Success'
      style={{
        backgroundColor: '#7FD083',
        fontFamily: 'Poppins',
        color: 'white'
      }}
    />
  );
};

export default BulkOrderStatusCell;
