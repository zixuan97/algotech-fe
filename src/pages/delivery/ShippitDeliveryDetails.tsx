import React from 'react';
import { useNavigate } from 'react-router';
import {
  Tooltip,
  IconButton,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useSearchParams } from 'react-router-dom';
import { getDeliveryOrderByTracking } from 'src/services/deliveryServices';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { DeliveryOrder } from 'src/models/types';
import moment from 'moment';

const steps = [
  {
    label: 'Order placed',
    status: 'order_placed',
    description: 'Thursday 29 September, 3:07PM GMT+8'
  },
  {
    label: 'Packing order',
    status: 'despatch_in_progress',
    description: 'Thursday 29 September, 5:27PM GMT+8'
  },
  {
    label: 'Booked for delivery',
    status: 'ready_for_pickup',
    description: 'Thursday 29 September, 5:29PM GMT+8'
  },
  {
    label: 'Out for delivery',
    status: 'untrackable',
    description: 'Thursday 29 September, 5:29PM GMT+8'
  },
  {
    label: 'Delivered',
    description: 'Thursday 29 September, 5:29PM GMT+8'
  }
];

const ShippitDeliveryDetails = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = React.useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState(2);
  const [deliveryOrder, setDeliveryOrder] = React.useState<DeliveryOrder>();
  const [trackingUrl, setTrackingUrl] = React.useState<string>('');

  React.useEffect(() => {
    setLoading(true);
    console.log(id);
    if (id) {
      asyncFetchCallback(
        getDeliveryOrderByTracking(id),
        (res) => {
          setDeliveryOrder(res);
          setTrackingUrl('https://app.staging.shippit.com/tracking/' + id);
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [id]);

  return (
    <div className='view-delivery-details'>
      <div className='view-delivery-details-top-section'>
        <div className='delivery-details-section-header'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>View Shippit Delivery</h1>
        </div>
        <div className='track-order-button-container'>
          <Button
            variant='contained'
            startIcon={<LocalShippingIcon />}
            href={trackingUrl}
          >
            Track Order
          </Button>
        </div>
      </div>
      <div className='shippit-delivery-details-stepper'>
        <Stepper activeStep={activeStep} orientation='vertical'>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className='delivery-detail-cards'>
        <Paper elevation={2} className='delivery-address-card'>
          <div className='delivery-address-grid'>
            <h3 className='labelText'>Delivery Address</h3>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <h4 className='labelText'>Name</h4>
                <Typography>
                  {deliveryOrder?.salesOrder.customerName}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <h4 className='labelText'>Address</h4>
                <Typography>
                  {deliveryOrder?.salesOrder.customerAddress}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Country</h4>
                <Typography>Singapore</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Postal Code</h4>
                <Typography> {deliveryOrder?.salesOrder.postalCode}</Typography>
              </Grid>
            </Grid>
          </div>
        </Paper>
        <Paper elevation={2} className='delivery-mode-card'>
          <div className='delivery-address-grid'>
            <h3 className='labelText'>Delivery Details</h3>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h4 className='labelText'>Delivery Mode</h4>
                <Typography>{deliveryOrder?.deliveryMode}</Typography>
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Carrier</h4>
                <Typography>{deliveryOrder?.carrier}</Typography>
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Delivery Date</h4>
                <Typography>
                  {moment(deliveryOrder?.deliveryDate).format('DD-MM-YYYY')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Tracking Number</h4>
                <Typography>{deliveryOrder?.shippitTrackingNum}</Typography>
              </Grid>
            </Grid>
            <div className='delivery-actions-button-container'>
              <Button
                variant='contained'
                size='medium'
                sx={{ height: 'fit-content' }}
                onClick={() => {}}
              >
                Confirm Order
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default ShippitDeliveryDetails;
