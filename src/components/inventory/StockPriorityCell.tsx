import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { StockPriorityType } from 'src/pages/inventory/InventoryDashboard';

const StockPriorityCell = (params: GridRenderCellParams) => {
  const value = params.value as StockPriorityType;

  if (value === StockPriorityType.LOW) {
    return <Chip label='Sufficient Stock' color='success' />;
  } else if (value === StockPriorityType.MEDIUM) {
    return <Chip label='Should Restock' color='warning' />;
  } else {
    return <Chip label='Low Stock' color='error' />;
  }
};

export default StockPriorityCell;
