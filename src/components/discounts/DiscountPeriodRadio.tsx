import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import React from 'react';

interface props {
  radioValue: string;
  handleRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DiscountPeriodRadio = ({ radioValue, handleRadioChange }: props) => {
  return (
    <FormControl>
      <FormLabel>Discount Period</FormLabel>
      <RadioGroup row value={radioValue} onChange={handleRadioChange}>
        <FormControlLabel value='fixed' control={<Radio />} label='Fixed' />
        <FormControlLabel
          value='recurring'
          control={<Radio />}
          label='Recurring'
        />
      </RadioGroup>
    </FormControl>
  );
};

export default DiscountPeriodRadio;
