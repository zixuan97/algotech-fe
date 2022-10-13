import React from 'react';
import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import '../../styles/common/actionCells.scss';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

const ViewNewsletterButton = ({ id }: GridRenderCellParams) => {
  const navigate = useNavigate();
  return (
    <div className='action-cell'>
      <Button
        variant='contained'
        onClick={() =>
          navigate({
            pathname: '/customer/viewNewsletterTemplate',
            search: createSearchParams({
              id: id.toString()
            }).toString()
          })
        }
      >
        View Newsletter
      </Button>
    </div>
  );
};

export default ViewNewsletterButton;
