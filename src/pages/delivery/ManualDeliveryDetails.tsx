import React from 'react';
import { useNavigate } from 'react-router';
import {
  Tooltip,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Paper,
  Typography,
  Button
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import {
  PlaylistAddCheckCircleRounded,
  LocalShippingRounded,
  TaskAltRounded
} from '@mui/icons-material';

const steps = [
  {
    label: 'Ready for Delivery',
    icon: <PlaylistAddCheckCircleRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Out for Delivery'
  },
  {
    label: 'Out for Delivery',
    icon: <LocalShippingRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Order Delivered'
  },
  {
    label: 'Order Delivered',
    icon: <TaskAltRounded sx={{ fontSize: 35 }} />
  }
];

const ManualDeliveryDetails = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState<number>(0);

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
      <div className='delivery-details-stepper'>
        <Stepper activeStep={0} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel icon={step.icon}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className='delivery-details-action'>
        <Paper elevation={2} className='action-card'>
          <Typography sx={{ fontSize: 'inherit' }}>Next Action:</Typography>
          <Button variant='contained' size='medium' onClick={() => {}}>
            {steps[activeStep].nextAction}
          </Button>
        </Paper>
      </div>
    </div>
  );
};

export default ManualDeliveryDetails;
