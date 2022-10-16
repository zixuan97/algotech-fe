import { Step, StepLabel, Stepper } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { BulkOrderStatus } from 'src/models/types';
import { bulkOrderSteps } from './bulkOrderSteps';

interface props {
  bulkOrderStatus: BulkOrderStatus;
}

const BulkOrderStepper = ({ bulkOrderStatus }: props) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const statusStepper = useMemo(
    () =>
      //Orders always come in paid
      //Cancelled, will only see created, cancelled (active), fulfilled
      //Payment failure will see created, payment failure, fulfilled
      //Payment success will see created, payment success, fulfilled :: happy path
      bulkOrderStatus === BulkOrderStatus.CANCELLED
        ? bulkOrderSteps.filter((step) => {
            return (
              step.currentState !== BulkOrderStatus.PAYMENT_SUCCESS &&
              step.currentState !== BulkOrderStatus.PAYMENT_FAILED
            );
          })
        : bulkOrderStatus === BulkOrderStatus.PAYMENT_FAILED
        ? bulkOrderSteps.filter((step) => {
            return (
              step.currentState !== BulkOrderStatus.CANCELLED &&
              step.currentState !== BulkOrderStatus.PAYMENT_SUCCESS
            );
          })
        : bulkOrderSteps.filter((step) => {
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
          <StepLabel icon={step.icon}>{step.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default BulkOrderStepper;
