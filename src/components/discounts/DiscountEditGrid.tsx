import { Grid, InputAdornment, MenuItem, TextField } from '@mui/material';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { DiscountCode, DiscountCodeType } from 'src/models/types';
import { validityCheck } from 'src/pages/discounts/CreateNewDiscountCode';
import { MomentRange } from 'src/utils/dateUtils';
import DiscountDateToggle from './DiscountDateToggle';
import EditEmailGrid from './EditEmailGrid';

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
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment(editDiscountCode.startDate),
    moment(editDiscountCode.endDate)
  ]);

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

  useEffect(() => {
    setEditDiscountCode((prev: DiscountCode) => {
      return {
        ...prev,
        startDate: moment(dateRange[0]).startOf('day').toDate(),
        endDate: moment(dateRange[1]).startOf('day').toDate()
      };
    });
  }, [dateRange, setEditDiscountCode]);

  return (
    <form>
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
              (validityCheck(editDiscountCode.amount?.toString()!) ||
                (editDiscountCode?.type === DiscountCodeType.PERCENTAGE &&
                  editDiscountCode.amount > 99)) &&
              showAmtError
            }
            helperText={
              (validityCheck(editDiscountCode.amount?.toString()!) ||
                (editDiscountCode?.type === DiscountCodeType.PERCENTAGE &&
                  editDiscountCode.amount > 99)) &&
              showAmtError
                ? 'Please provide an appropriate amount for discount'
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
                ? 'Please provide a minimum amount for discount to be applicable'
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              )
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

        <Grid item xs={12}>
          <DiscountDateToggle
            editDiscountCode={editDiscountCode}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </Grid>
        <Grid item xs={12}>
          <EditEmailGrid
            emails={editDiscountCode.customerEmails}
            updateEmails={(emails) =>
              setEditDiscountCode(
                (prev: DiscountCode) =>
                  prev && {
                    ...prev,
                    customerEmails: emails
                  }
              )
            }
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default DiscountEditGrid;
