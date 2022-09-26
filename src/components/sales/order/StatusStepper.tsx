import { Step, StepLabel, Stepper } from '@mui/material';
import { useEffect, useState } from 'react';
import { OrderStatus } from 'src/models/types';
import { steps } from './steps';

interface props {
  orderStatus: OrderStatus;
}

const StatusStepper = ({ orderStatus }: props) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  useEffect(() => {
    setActiveStep(steps.findIndex((step) => step.currentState === orderStatus));
  }, [orderStatus]);

  return (
    <Stepper activeStep={activeStep} alternativeLabel className='sales-stepper'>
      {steps.map((step) => (
        <Step key={step.label}>
          <StepLabel icon={step.icon}>{step.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StatusStepper;
