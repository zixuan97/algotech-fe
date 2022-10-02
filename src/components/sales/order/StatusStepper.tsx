import { Step, StepLabel, Stepper } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { OrderStatus } from 'src/models/types';
import { steps } from './steps';

interface props {
  orderStatus: OrderStatus;
}

const StatusStepper = ({ orderStatus }: props) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const statusStepper = useMemo(
    () =>
    orderStatus === OrderStatus.CANCELLED
        ? steps.filter((step) => {
          return step.currentState !== OrderStatus.PAID
        })
        : steps.filter((step) => {
          return step.currentState !== OrderStatus.CANCELLED
        }),
    [orderStatus]
  );

  useEffect(() => {
    setActiveStep(statusStepper.findIndex((step) => {return step.currentState === orderStatus}));
  }, [orderStatus, statusStepper]);

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

export default StatusStepper;
