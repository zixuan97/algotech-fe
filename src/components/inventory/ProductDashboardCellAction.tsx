import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import '../../styles/common/actionCells.scss';

const ProductDashboardCellAction = ({ id }: GridRenderCellParams) => {
  return (
    <div className='action-cell'>
      <Button variant='contained' sx={{ fontSize: '0.75rem' }}>
        Place Procurement Order
      </Button>
      <Button variant='contained' sx={{ fontSize: '0.75rem' }}>
        Generate Inventory History
      </Button>
    </div>
  );
};

export default ProductDashboardCellAction;
