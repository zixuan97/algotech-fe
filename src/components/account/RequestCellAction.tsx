import React from 'react';
import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import '../../styles/common/actionCells.scss';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

const RequestCellAction = ({ id }: GridRenderCellParams) => {
  const navigate = useNavigate();
  const navToViewAccount = (edit: boolean) =>
    navigate({
      pathname: '/accounts/viewAccountRequest',
      search: createSearchParams({
        id: id.toString(),
      }).toString()
    });
  return (
    <div className='action-cell'>
      <Button variant='contained' onClick={() => navToViewAccount(false)}>
        View Request
      </Button>
    </div>
  );
};

export default RequestCellAction;
