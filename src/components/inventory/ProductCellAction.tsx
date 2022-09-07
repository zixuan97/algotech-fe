import React from 'react';
import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import '../../styles/common/actionCells.scss';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

const ProductCellAction = ({ id }: GridRenderCellParams) => {
  const navigate = useNavigate();
  const navToViewProduct = (edit: boolean) =>
    navigate({
      pathname: '/inventory/viewProduct',
      search: createSearchParams({
        id: id.toString(),
        ...(edit && { edit: Boolean(edit).toString() })
      }).toString()
    });
  return (
    <div className='action-cell'>
      <Button variant='contained' onClick={() => navToViewProduct(false)}>
        View
      </Button>
      <Button variant='contained' onClick={() => navToViewProduct(true)}>
        Edit
      </Button>
    </div>
  );
};

export default ProductCellAction;
