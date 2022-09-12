import React from 'react';
import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import '../../styles/common/actionCells.scss';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

const CategoryCellAction = ({ id }: GridRenderCellParams) => {
  const navigate = useNavigate();
  return (
      <div className='action-cell'>
        <Button
          variant='contained'
          onClick={() =>
            navigate({
              pathname: '/inventory/categoryDetails',
              search: createSearchParams({
                id: id.toString()
              }).toString()
            })
          }
          >
            View Category
          </Button>
      </div>
  );
};

export default CategoryCellAction;