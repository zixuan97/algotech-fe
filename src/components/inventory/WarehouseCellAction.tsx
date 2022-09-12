import React from 'react';
import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import '../../styles/common/actionCells.scss';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

const WarehouseCellAction = ({ id }: GridRenderCellParams) => {
  const navigate = useNavigate();
  return (
      <div className='action-cell'>
        <Button
          variant='contained'
          onClick={() =>
            navigate({
              pathname: '/inventory/warehouseDetails',
              search: createSearchParams({
                id: id.toString()
              }).toString()
            })
          }
          >
            View Warehouse
          </Button>
          {}
      </div>
  );
};

export default WarehouseCellAction;