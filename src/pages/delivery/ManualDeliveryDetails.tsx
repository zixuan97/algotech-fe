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
  Button,
  Grid
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import {
  PlaylistAddCheckCircleRounded,
  LocalShippingRounded,
  TaskAltRounded
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { DeliveryOrder } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getDeliveryOrderById } from 'src/services/deliveryServices';

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
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [originalDeliveryOrder, setOriginalDeliveryOrder] =
    React.useState<DeliveryOrder>();
  const [updatedDeliveryOrder, setUpdatedDeliveryOrder] =
    React.useState<DeliveryOrder>();
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(
        getDeliveryOrderById(id),
        (res) => {
          setOriginalDeliveryOrder(res);
          setUpdatedDeliveryOrder(res);
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [id]);

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
      <div className='delivery-details-action-section'>
        <Paper elevation={2} className='delivery-details-action-card'>
          <Typography sx={{ fontSize: 'inherit' }}>Next Action:</Typography>
          <Button variant='contained' size='medium' onClick={() => {}}>
            {steps[activeStep].nextAction}
          </Button>
        </Paper>
      </div>
      <div className='delivery-detail-cards'>
        <Paper elevation={2} className='delivery-address-card'>
          <div className='delivery-address-grid'>
            <h3 className='labelText'>Delivery Address</h3>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <h4 className='labelText'>Name</h4>
                <Typography>John Tan</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Address Line 1</h4>
                <Typography>123 Bedok Road</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Address Line 2</h4>
                <Typography>#01-09</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Country</h4>
                <Typography>Singapore</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Postal Code</h4>
                <Typography>434503</Typography>
              </Grid>
            </Grid>
          </div>
        </Paper>
        <Paper elevation={2} className='delivery-mode-card'>
          <div className='delivery-mode-grid'>
            <h3 className='labelText'>Delivery Mode</h3>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <h4 className='labelText'>Delivery Method</h4>
                <Typography>Manual Delivery</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>To be Delivered By</h4>
                <Typography>Jane (Intern)</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Comments</h4>
                <Typography>
                  Jane will deliver otw to work on Monday.
                </Typography>
              </Grid>
              <div className='delivery-actions-button-container'>
                <Button
                  variant='contained'
                  size='medium'
                  sx={{ height: 'fit-content' }}
                  onClick={() => {}}
                >
                  Download DO
                </Button>

                <Button
                  variant='contained'
                  size='medium'
                  sx={{ height: 'fit-content' }}
                  onClick={() => {}}
                >
                  Download Waybill
                </Button>
              </div>
            </Grid>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default ManualDeliveryDetails;
