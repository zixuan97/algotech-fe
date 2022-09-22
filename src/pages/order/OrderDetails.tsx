import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/pages/orders.scss';
import '../../styles/common/common.scss';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Tooltip,
  Typography
} from '@mui/material';
import {
  ChevronLeft,
  ReceiptLongRounded,
  AccountBalanceWalletRounded,
  ConstructionRounded,
  PlaylistAddCheckCircleRounded,
  LocalShippingRounded,
  TaskAltRounded
} from '@mui/icons-material';
import { PlatformType, SalesOrder } from 'src/models/types';
import { useNavigate } from 'react-router-dom';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';

const steps = [
  {
    label: 'Order Placed',
    icon: <ReceiptLongRounded />
  },
  {
    label: 'Order Paid',
    icon: <AccountBalanceWalletRounded />
  },
  {
    label: 'Preparing Order',
    icon: <ConstructionRounded />
  },
  {
    label: 'Ready For Delivery',
    icon: <PlaylistAddCheckCircleRounded />
  },
  {
    label: 'Order Shipped',
    icon: <LocalShippingRounded />
  },
  {
    label: 'Order Received',
    icon: <TaskAltRounded />
  }
];

const OrderDetails = () => {
  const navigate = useNavigate();
  const [salesOrders, setSalesOrders] = useState<Partial<SalesOrder>>({});
  const [loading, setLoading] = React.useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [activeStep, setActiveStep] = React.useState<number>(3);

  return (
    <>
      <Tooltip title='Return to Accounts' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate(-1)}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>

      <div className='center-div'>
        <Box className='center-box'>
          <div className='header-content'>
            {/* {loading && <CircularProgress color='secondary' />} */}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              className='sales-stepper'
            >
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Paper elevation={2} className='action-card'>
              <Typography sx={{ fontSize: 'inherit' }}>Next Action:</Typography>
              <Button variant='contained' size='medium'>
                Manage Order
              </Button>
            </Paper>
          </div>

          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />

          <Paper elevation={1}>
            <div className='content-body'>Hello World</div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default OrderDetails;
