import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { PaymentMode } from 'src/models/types';

const PaymentModeCell = ({ row }: GridRenderCellParams) => {
  const paymentMode = row.paymentMode;

  return paymentMode === PaymentMode.CREDIT_CARD? (
    <Chip
      label='Credit Card'
      style={{ backgroundColor: 'FBE9BA', fontFamily: 'Poppins' }}
    />
  )  :  (
    <Chip
      label='Paynow'
      style={{
        backgroundColor: '#E2D8F5',
        fontFamily: 'Poppins'
      }}
    />
  );
};

export default PaymentModeCell;
