import { Step, StepLabel, Stepper } from '@mui/material';
import { steps } from './steps';

interface props {
  activeStep: number;
}

const StatusStepper = ({ activeStep }: props) => {
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
