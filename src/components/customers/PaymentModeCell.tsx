import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { PaymentMode } from 'src/models/types';

const PaymentModeCell = ({ row }: GridRenderCellParams) => {
  const paymentMode = row.paymentMode;

  return paymentMode === PaymentMode.CREDIT_CARD? (
    <Chip
      label='Credit Card'
      style={{ backgroundColor: '#F6B992', fontFamily: 'Poppins' }}
    />
  ) : paymentMode === PaymentMode.BANK_TRANSFER ? (
    <Chip
      label='Bank Transfer'
      style={{ backgroundColor: '#9BBFE0', fontFamily: 'Poppins' }}
    />
  ) :  (
    <Chip
      label='Paynow'
      style={{
        backgroundColor: '#C6D68F',
        fontFamily: 'Poppins',
        color: 'white'
      }}
    />
  );
};

export default PaymentModeCell;
