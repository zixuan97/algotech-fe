import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/pages/orders.scss';
import '../../styles/common/common.scss';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import {
  ChevronLeft,
  ReceiptLongRounded,
  AccountBalanceWalletRounded,
  PlaylistAddCheckCircleRounded,
  LocalShippingRounded,
  TaskAltRounded
} from '@mui/icons-material';
import { OrderStatus, PlatformType, SalesOrder } from 'src/models/types';
import { useNavigate } from 'react-router-dom';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import salesContext from 'src/context/sales/salesContext';

const steps = [
  {
    label: 'Order Placed',
    icon: <ReceiptLongRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Confirm Payment'
  },
  {
    label: 'Order Paid',
    icon: <AccountBalanceWalletRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Complete Prep'
  },
  {
    label: 'Order Prepared',
    icon: <PlaylistAddCheckCircleRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Schedule Delivery'
  },
  {
    label: 'Order Shipped',
    icon: <LocalShippingRounded sx={{ fontSize: 35 }} />,
    nextAction: 'View Delivery'
  },
  {
    label: 'Order Received',
    icon: <TaskAltRounded sx={{ fontSize: 35 }} />,
    nextAction: 'View Delivery'
  }
];

const SalesOrderDetails = () => {
  let params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  //For now, will fetch from context, in future, will use API call
  const { salesOrders } = React.useContext(salesContext);
  const [salesOrder, setSalesOrder] = useState<SalesOrder>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [activeStep, setActiveStep] = React.useState<number>(0);

  const id = params.get('id');

  useEffect(() => {
    setLoading(true);
    const saleOrd = salesOrders.find((order) => {
      return order.id === parseInt(id!);
    });

    if (saleOrd) {
      setSalesOrder(saleOrd);
      switch (saleOrd.orderStatus) {
        case OrderStatus.PAID: {
          setActiveStep(1);
          break;
        }
        case OrderStatus.PREPARED: {
          setActiveStep(2);
          break;
        }
        case OrderStatus.SHIPPED: {
          setActiveStep(3);
          break;
        }
        case OrderStatus.COMPLETED: {
          setActiveStep(4);
          break;
        }
        default: {
          break;
        }
      }
      setLoading(false);
    }
  }, [id, salesOrders]);

  const nextStep = () => {
    switch (salesOrder?.orderStatus) {
      case OrderStatus.CREATED: {
        setActiveStep(0);
        break;
      }
      case OrderStatus.PAID: {
        setActiveStep(1);
        break;
      }
      case OrderStatus.PREPARED: {
        setActiveStep(2);
        break;
      }
      case OrderStatus.SHIPPED: {
        setActiveStep(3);
        break;
      }
      case OrderStatus.COMPLETED: {
        setActiveStep(4);
        break;
      }
      default: {
        break;
      }
    }
  };
  return (
    <>
      <div className='top-carrot'>
        <Tooltip title='Return to Accounts' enterDelay={300}>
          <IconButton size='large' onClick={() => navigate(-1)}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>

        <div style={{ margin: '1%' }}>
          <Typography>Placed With</Typography>
          <Chip
            label={salesOrder?.platformType}
            color={
              salesOrder?.platformType === PlatformType.SHOPEE
                ? 'warning'
                : salesOrder?.platformType === PlatformType.SHOPIFY
                ? 'primary'
                : 'info'
            }
          />
        </div>
      </div>

      <div className='center-div'>
        <Box className='center-box'>
          <div className='header-content'>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              className='sales-stepper'
            >
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel icon={step.icon}>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Paper elevation={2} className='action-card'>
              <Typography sx={{ fontSize: 'inherit' }}>Next Action:</Typography>
              <Button
                variant='contained'
                size='medium'
                onClick={() => nextStep()}
              >
                {steps[activeStep].nextAction}
              </Button>
            </Paper>
          </div>

          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />

          <Paper elevation={2}>
            <div className='content-body'>
              <div className='grid-toolbar'>
                <h4>Customer Name: {salesOrder?.customerName}</h4>
                <h4>Order ID.: #{salesOrder?.id}</h4>
              </div>

              <TableContainer component={Paper}>
                <Table aria-label='collapsible table'>
                  <TableHead style={{ backgroundColor: '#BDBDBD' }}>
                    <TableRow>
                      <TableCell align='left' colSpan={7}>
                        Products
                      </TableCell>
                      <TableCell align='right' colSpan={1}>
                        Item Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesOrder?.salesOrderItems.map((item) => (
                      <TableRow>
                        <TableCell align='left' colSpan={7}>
                          {item.productName} x{item.quantity}
                        </TableCell>
                        <TableCell align='right' colSpan={1}>
                          ${item.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className='order-summary-card'>
                <div>
                  <h5>Merchandising Total: ${salesOrder?.amount}</h5>
                  <h5>Shipping: -</h5>
                  <h5>Order Subtotal: ${salesOrder?.amount}</h5>
                  <h5>
                    Payment Method:
                    {salesOrder?.platformType === PlatformType.OTHERS
                      ? ' PayNow'
                      : ' eCommerce'}
                  </h5>
                </div>
              </div>
            </div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default SalesOrderDetails;
