import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

const CreateNewsletterTemplate = () => {
  const navigate = useNavigate();

  return (
    <div className='create-newsletter-template'>
      <div className='create-newsletter-template-heading'>
        <Tooltip title='Return to Previous Page' enterDelay={300}>
          <IconButton size='large' onClick={() => navigate(-1)}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <h1>Create Newsletter Template</h1>
      </div>
    </div>
  );
};

export default CreateNewsletterTemplate;
