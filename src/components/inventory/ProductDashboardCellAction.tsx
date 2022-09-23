import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import '../../styles/common/actionCells.scss';

const ProductDashboardCellAction = ({ id }: GridRenderCellParams) => {
  const navigate = useNavigate();

  return (
    <div className='button-group'>
      <Button
        variant='contained'
        onClick={() =>
          navigate({
            pathname: '/inventory/productDetails',
            search: createSearchParams({
              id: id.toString()
            }).toString()
          })
        }
      >
        View Details
      </Button>
      <Button
        variant='contained'
        sx={{ fontSize: '0.75rem' }}
        onClick={() =>
          navigate({
            pathname: '/procurementOrders/createProcurementOrder',
            search: createSearchParams({
              id: id.toString()
            }).toString()
          })
        }
      >
        Place Procurement Order
      </Button>
    </div>
  );
};

export default ProductDashboardCellAction;
