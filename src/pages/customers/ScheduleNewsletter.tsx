import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

const ScheduleNewsletter = () => {
  const navigate = useNavigate();

  return (
    <div className='schedule-newsletter'>
      <div className='schedule-newsletter-heading'>
        <Tooltip title='Return to Previous Page' enterDelay={300}>
          <IconButton size='large' onClick={() => navigate(-1)}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <h1>Schedule Newsletter</h1>
      </div>
    </div>
  );
};

export default ScheduleNewsletter;
