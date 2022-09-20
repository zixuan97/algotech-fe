import React from 'react';
import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import '../../styles/common/actionCells.scss';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

const DeliveryCellAction = ({ id }: GridRenderCellParams) => {
  const navigate = useNavigate();
  return (
      <div className='action-cell-fit-content'>
        <Button
          variant='contained'
          onClick={() =>
            navigate({
              pathname: '',
              search: createSearchParams({
                id: id.toString()
              }).toString()
            })
          }
          >
            View Delivery Info
          </Button>
      </div>
  );
};

export default DeliveryCellAction;