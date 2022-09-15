import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { Product, StockQuantity } from 'src/models/types';

const StockPriorityCell = ({ row }: GridRenderCellParams) => {
  const { qtyThreshold, stockQuantity } = row as Product;
  if (!qtyThreshold) {
    return <Chip label='No Threshold Set' color='info' />;
  }
  const totalQty =
    stockQuantity.reduce(
      (prev: number, curr: StockQuantity) => prev + curr.quantity,
      0
    ) ?? 0;
  return totalQty === qtyThreshold ? (
    <Chip label='Should Restock' color='warning' />
  ) : totalQty > qtyThreshold ? (
    <Chip label='Sufficient Stock' color='success' />
  ) : (
    <Chip label='Low Stock' color='error' />
  );
};

export default StockPriorityCell;
