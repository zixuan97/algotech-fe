import {
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import _ from 'lodash';
import { useState } from 'react';
import { DiscountCode, DiscountCodeType } from 'src/models/types';
import { validityCheck } from 'src/pages/discounts/CreateNewDiscountCode';

interface props {
  editDiscountCode: DiscountCode;
  setEditDiscountCode: (discountCode: any) => void;
}

let discountCodeType = Object.keys(DiscountCodeType).filter((v) =>
  isNaN(Number(v))
);

const DiscountEditGrid = ({ editDiscountCode, setEditDiscountCode }: props) => {
  const [showAmtError, setShowAmtError] = useState<boolean>(false);
  const [showMinAmtError, setShowMinAmtError] = useState<boolean>(false);

  const disountFieldsOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditDiscountCode((prev: DiscountCode) => {
      return {
        ...prev!,
        [key]:
          key === 'amount' || key === 'minOrderAmount'
            ? parseInt(event.target.value)
            : event.target.value
      };
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          disabled
          fullWidth
          id='outlined-amount'
          label='Discount Code *'
          value={editDiscountCode.discountCode}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          id='outlined-amount'
          select
          label='Discount Type *'
          value={editDiscountCode.type}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            disountFieldsOnChange(e, 'type');
          }}
        >
          {discountCodeType.map((option) => (
            <MenuItem key={option} value={option}>
              {_.startCase(option.toLowerCase())}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          id='outlined-required'
          label='Discount Amount *'
          name='amount'
          placeholder='e.g. 10'
          type='number'
          error={
            validityCheck(editDiscountCode.amount?.toString()!) && showAmtError
          }
          helperText={
            validityCheck(editDiscountCode.amount?.toString()!) && showAmtError
              ? 'Please provide an amount for discount'
              : ''
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                {editDiscountCode?.type === DiscountCodeType.FLAT_AMOUNT
                  ? '$'
                  : '%'}
              </InputAdornment>
            )
          }}
          inputProps={{
            inputMode: 'numeric',
            min: '0'
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            disountFieldsOnChange(e, 'amount');
            setShowAmtError(true);
          }}
          value={editDiscountCode?.amount}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          id='outlined-required'
          label='Minimum Order Amount *'
          name='minOrderAmount'
          placeholder='e.g. 150'
          type='number'
          error={
            validityCheck(editDiscountCode.minOrderAmount?.toString()!) &&
            showMinAmtError
          }
          helperText={
            validityCheck(editDiscountCode.minOrderAmount?.toString()!) &&
            showMinAmtError
              ? 'Please provide an minimum amount for discount to be applicable'
              : ''
          }
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>
          }}
          inputProps={{
            inputMode: 'numeric',
            min: '0'
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            disountFieldsOnChange(e, 'minOrderAmount');
            setShowMinAmtError(true);
          }}
          value={editDiscountCode?.minOrderAmount}
        />
      </Grid>
    </Grid>
  );
};

export default DiscountEditGrid;
