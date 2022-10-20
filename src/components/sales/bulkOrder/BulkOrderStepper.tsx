import { Step, StepLabel, Stepper, Tooltip } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { BulkOrderStatus } from 'src/models/types';
import {
  ReceiptLongRounded,
  AccountBalanceWalletRounded,
  PlaylistAddCheckCircleRounded,
  DoDisturbOffRounded
} from '@mui/icons-material';

interface props {
  bulkOrderStatus: BulkOrderStatus;
}

export const BulkOrderSteps = [
  {
    currentState: BulkOrderStatus.CREATED,
    label: 'Order Placed',
    icon: <ReceiptLongRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Confirm Payment',
    altAction: 'Cancel Order',
    tooltip: 'Once payment has been confirmed, you can begin preparing the order.'
  },
  {
    currentState: BulkOrderStatus.CANCELLED,
    label: 'Order Cancelled',
    icon: <DoDisturbOffRounded sx={{ fontSize: 35 }} />,
    nextAction: 'No Further Actions',
    altAction: 'No Further Actions',
    tooltip: 'Order has been cancelled, no further actions from your end.'
  },
  {
    currentState: BulkOrderStatus.PAYMENT_FAILED,
    label: 'Payment Failed',
    icon: <AccountBalanceWalletRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Contact Admin',
    altAction: 'No Further Actions',
    tooltip: 'Customers will retry payment, otherwise, there is no actions from your end needed.'
  },
  {
    currentState: BulkOrderStatus.PAYMENT_SUCCESS,
    label: 'Order Paid',
    icon: <AccountBalanceWalletRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Bulk Prepare',
    altAction: 'Complete Order',
    tooltip:
      'Bulk prepare the orders, otherwise individually prepare each order.'
  },
  {
    currentState: BulkOrderStatus.FULFILLED,
    label: 'Order Fulfilled',
    icon: <PlaylistAddCheckCircleRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Back To All Bulk Order',
    altAction: 'No Further Actions',
    tooltip: 'Order completed, no further actions from your end.'
  }
];


const BulkOrderStepper = ({ bulkOrderStatus }: props) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const statusStepper = useMemo(
    () =>
      //Orders always come in paid
      //Cancelled, will only see created, cancelled (active), fulfilled
      //Payment failure will see created, payment failure, fulfilled
      //Payment success will see created, payment success, fulfilled :: happy path
      bulkOrderStatus === BulkOrderStatus.CANCELLED
        ? BulkOrderSteps.filter((step) => {
            return (
              step.currentState !== BulkOrderStatus.PAYMENT_SUCCESS &&
              step.currentState !== BulkOrderStatus.PAYMENT_FAILED
            );
          })
        : bulkOrderStatus === BulkOrderStatus.PAYMENT_FAILED
        ? BulkOrderSteps.filter((step) => {
            return (
              step.currentState !== BulkOrderStatus.CANCELLED &&
              step.currentState !== BulkOrderStatus.PAYMENT_SUCCESS
            );
          })
        : BulkOrderSteps.filter((step) => {
            return (
              step.currentState !== BulkOrderStatus.CANCELLED &&
              step.currentState !== BulkOrderStatus.PAYMENT_FAILED
            );
          }),
    [bulkOrderStatus]
  );

  useEffect(() => {
    setActiveStep(
      statusStepper.findIndex((step) => {
        return step.currentState === bulkOrderStatus;
      })
    );
  }, [bulkOrderStatus, statusStepper]);

  return (
    <Stepper activeStep={activeStep} alternativeLabel className='sales-stepper'>
      {statusStepper.map((step) => (
        <Step key={step.label}>
          <Tooltip title={step.tooltip} enterDelay={300}>
            <StepLabel icon={step.icon}>{step.label}</StepLabel>
          </Tooltip>
        </Step>
      ))}
    </Stepper>
  );
};

export default BulkOrderStepper;
