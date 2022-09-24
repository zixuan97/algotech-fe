import React from 'react';
import { useNavigate } from 'react-router';
import {
  Tooltip,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Box
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import {
  ReceiptLongRounded,
  LocalShippingRounded,
  TaskAltRounded
} from '@mui/icons-material';

const steps = [
  {
    label: 'Ready for Delivery',
    icon: <ReceiptLongRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Confirm Payment'
  },
  {
    label: 'Order is Out for Delivery',
    icon: <LocalShippingRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Begin Prep'
  },
  {
    label: 'Order Delivered',
    icon: <TaskAltRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Complete Prep'
  }
];

const ManualDeliveryDetails = () => {
  const navigate = useNavigate();

  return (
    <div className='view-delivery-details'>
      <div className='delivery-details-section-header'>
        <Tooltip title='Return to Previous Page' enterDelay={300}>
          <IconButton size='large' onClick={() => navigate(-1)}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <h1>View Manual Delivery Order ID: #1</h1>
      </div>
      <div>
        <Stepper activeStep={0} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel icon={step.icon}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
};

export default ManualDeliveryDetails;
