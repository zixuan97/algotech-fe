import React from 'react';
import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import '../../styles/common/actionCells.scss';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import { JobStatus } from 'src/models/types';

const ScheduledNewsletterCellAction = ({ row }: GridRenderCellParams) => {
  const navigate = useNavigate();

  return (
    <div className='action-cell-fit-content'>
      <Button
        variant='contained'
        onClick={() =>
          navigate({
            pathname: '/customer/viewScheduledNewsletter',
            search: createSearchParams({
              id: row.id.toString()
            }).toString()
          })
        }
      >
        {row.jobStatus === JobStatus.SCHEDULED
          ? 'View Scheduled Newsletter'
          : row.jobStatus === JobStatus.SENT
          ? 'View Sent Newsletter'
          : 'View Cancelled Newsletter'}
      </Button>
    </div>
  );
};

export default ScheduledNewsletterCellAction;
