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
  Paper,
  Backdrop,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useSearchParams } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { DeliveryOrder, LalamoveDriver } from 'src/models/types';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import {
  cancelLalamoveDelivery,
  getLalamoveDeliveryOrderById,
  getLalamoveDeliveryOrderByLalamoveId,
  getLalamoveDriverDetailsById
} from 'src/services/deliveryServices';
import moment from 'moment';

const steps = [
  {
    label: 'Assigning Driver',
    status: 'ASSIGNING_DRIVER'
  },
  {
    label: 'Driver Assigned',
    status: 'ON_GOING'
  },
  {
    label: 'Delivery in Progress',
    status: 'PICKED_UP'
  }
];

const LalamoveDeliveryDetails = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = React.useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [deliveryOrder, setDeliveryOrder] = React.useState<DeliveryOrder>();
  const [driver, setDriver] = React.useState<LalamoveDriver>();
  const [trackingUrl, setTrackingUrl] = React.useState<string>('');
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [cancelDeliveryModalOpen, setCancelDeliveryModalOpen] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);

    if (id) {
      asyncFetchCallback(getLalamoveDeliveryOrderById(id), (res) => {
        setDeliveryOrder(res);

        if (
          res.deliveryStatus!.status !== 'EXPIRED' &&
          res.deliveryStatus!.status !== 'CANCELED'
        ) {
          setActiveStep(
            steps.findIndex(
              (step) => step.status === res.deliveryStatus?.status
            )
          );
        } else {
          setActiveStep(-1);
        }

        asyncFetchCallback(
          getLalamoveDeliveryOrderByLalamoveId(res.shippitTrackingNum),
          (res) => {
            setTrackingUrl(res);
          }
        );

        if (
          res.deliveryStatus!.status === 'ON_GOING' ||
          res.deliveryStatus!.status === 'PICKED_UP'
        ) {
          asyncFetchCallback(getLalamoveDriverDetailsById(id), (res) => {
            setDriver(res);
          });
        }

        setLoading(false);
      });
    }
  }, [id]);

  const openTracking = async () => {
    window.open(trackingUrl, '_blank');
  };

  const handleCancelLalamoveDelivery = async () => {
    setCancelDeliveryModalOpen(false);
    setLoading(true);

    await asyncFetchCallback(
      cancelLalamoveDelivery(id!),
      (res) => {
        let updatedDeliveryStatus = Object.assign(
          {},
          deliveryOrder?.deliveryStatus,
          { status: 'CANCELED' }
        );

        setDeliveryOrder((deliveryOrder) => {
          if (deliveryOrder) {
            return {
              ...deliveryOrder,
              deliveryStatus: updatedDeliveryStatus
            };
          } else {
            return deliveryOrder;
          }
        });
        setAlert({
          severity: 'success',
          message: 'Lalamove Order cancelled successfully.'
        });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message: 'Lalamove Order could not be cancelled successfully.'
        });
      }
    );
  };

  return (
    <div className='view-delivery-details'>
      <div className='view-delivery-details-top-section'>
        <div className='delivery-details-section-header'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>View Lalamove Delivery</h1>
          {(deliveryOrder?.deliveryStatus?.status === 'CANCELED' ||
            deliveryOrder?.deliveryStatus?.status === 'EXPIRED') && (
            <div className='shippit-order-cancelled-chip-container'>
              <Chip
                label='Delivery Cancelled'
                style={{ backgroundColor: '#D9D9D9', fontFamily: 'Poppins' }}
              />
            </div>
          )}
        </div>
        <div className='track-order-button-container'>
          <Button
            variant='contained'
            startIcon={<LocalShippingIcon />}
            onClick={openTracking}
          >
            Track Order
          </Button>
          {deliveryOrder?.deliveryStatus?.status === 'ASSIGNING_DRIVER' && (
            <Button
              variant='contained'
              onClick={() => setCancelDeliveryModalOpen(true)}
            >
              Cancel Order
            </Button>
          )}
          <ConfirmationModal
            open={cancelDeliveryModalOpen}
            onClose={() => setCancelDeliveryModalOpen(false)}
            onConfirm={handleCancelLalamoveDelivery}
            title='Cancel Lalamove Delivery'
            body='Are you sure you want to cancel the delivery order? This action cannot be reversed.'
          />
        </div>
      </div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      {alert && (
        <div className='delivery-details-alert'>
          <TimeoutAlert
            alert={alert}
            timeout={6000}
            clearAlert={() => setAlert(null)}
          />
        </div>
      )}
      <div className='shippit-delivery-details-stepper'>
        <Stepper activeStep={activeStep} orientation='vertical'>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography>
                  Date: {deliveryOrder?.deliveryStatus?.date}
                </Typography>
                <Typography>
                  Time: {deliveryOrder?.deliveryStatus?.timestamp}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className='delivery-detail-cards'>
        <Paper elevation={2} className='delivery-address-card'>
          <div className='delivery-address-grid'>
            <h3 className='labelText'>Delivery Address</h3>
            <Divider />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h4 className='labelText'>Name</h4>
                <Typography>
                  {deliveryOrder?.salesOrder.customerName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <h4 className='labelText'>Address</h4>
                <Typography>
                  {deliveryOrder?.salesOrder.customerAddress}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Country</h4>
                <Typography>Singapore</Typography>
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Postal Code</h4>
                <Typography> {deliveryOrder?.salesOrder.postalCode}</Typography>
              </Grid>
            </Grid>
          </div>
        </Paper>
        <Paper elevation={2} className='delivery-mode-card'>
          <div className='delivery-address-grid'>
            <h3 className='labelText'>Delivery Details</h3>
            <Divider />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h4 className='labelText'>Estimated Delivery Date</h4>
                <Typography>
                  {moment(deliveryOrder?.deliveryDate).format('DD-MM-YYYY')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Lalamove Order ID</h4>
                <Typography>{deliveryOrder?.shippitTrackingNum}</Typography>
              </Grid>
              {driver && (
                <>
                  <Grid item xs={6}>
                    <h4 className='labelText'>Driver Name</h4>
                    <Typography>{driver.contact.name}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <h4 className='labelText'>Driver Contact Number</h4>
                    <Typography>{driver.contact.phone}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <h4 className='labelText'>Driver Plate Number</h4>
                    <Typography>{driver.plateNumber}</Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default LalamoveDeliveryDetails;
