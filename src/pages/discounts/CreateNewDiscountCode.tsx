import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Grid,
  Stack,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { DiscountCode, DiscountCodeType } from 'src/models/types';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import BottomButton from 'src/components/common/BottomButton';
import DiscountPeriodRadio from 'src/components/discounts/DiscountPeriodRadio';
import moment from 'moment';
import _ from 'lodash';
import DiscountDateRange from 'src/components/discounts/DiscountDateRange';
import validator from 'validator';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { createDiscountCodeSvc } from 'src/services/discountCodeService';

let discountCodeType = Object.keys(DiscountCodeType).filter((v) =>
  isNaN(Number(v))
);

const CreateNewDiscountCode = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [radioValue, setRadioValue] = useState<string>('fixed');
  const [newDiscountCode, setNewDiscountCode] = useState<Partial<DiscountCode>>(
    {
      isEnabled: true,
      startDate: moment().startOf('day').toDate(),
      endDate: moment().startOf('day').toDate()
    }
  );
  const [showDiscCodeError, setShowDiscCodeError] = useState<boolean>(false);
  const [showAmtError, setShowAmtError] = useState<boolean>(false);
  const [showMinAmtError, setShowMinAmtError] = useState<boolean>(false);

  const handleCreateButtonClick = (e: any) => {
    setLoading(true);
    asyncFetchCallback(
      createDiscountCodeSvc(newDiscountCode),
      () => {
        setAlert({
          severity: 'success',
          message: 'Discount Code Created.'
        });
        setAlert({
          severity: 'success',
          message:
            'Discount Code Created. You will be redirected to the All Discount Code page.'
        });
        setTimeout(() => navigate(-1), 3500);
      },
      () => {
        setAlert({
          severity: 'error',
          message: 'Error creating discount code! Try again later.'
        });
      }
    );
    setLoading(false);
  };

  const textFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setNewDiscountCode(() => {
      return {
        ...newDiscountCode,
        [key]:
          key === 'amount' || key === 'minOrderAmount'
            ? parseInt(event.target.value)
            : event.target.value
      };
    });
  };

  const validityCheck = (value: string) => {
    return value !== undefined && validator.isEmpty(value!);
  };
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
    setNewDiscountCode((prev) => {
      return {
        ...prev,
        endDate: prev.startDate
      };
    });
  };

  useEffect(() => {
    if (radioValue === 'recurring') {
      setNewDiscountCode((prev) => {
        return {
          ...prev,
          endDate: undefined
        };
      });
    }
  }, [radioValue]);

  return (
    <>
      <Tooltip title='Return to Accounts' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate(-1)}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>

      <div className='center-div'>
        <Box className='center-box'>
          <h1>Create New Discount Code</h1>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          <Paper elevation={2}>
            <form>
              <div className='content-body'>
                <div className='right-content'>
                  <Grid container spacing={2} justifyContent='space-between'>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        id='outlined-quantity'
                        label='Discount Code *'
                        name='discountCode'
                        placeholder='eg.: CNY2022'
                        error={
                          validityCheck(newDiscountCode.discountCode!) &&
                          showDiscCodeError
                        }
                        helperText={
                          validityCheck(newDiscountCode.discountCode!) &&
                          showDiscCodeError
                            ? 'Please provide a discount code'
                            : ''
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          textFieldOnChange(e, 'discountCode');
                          setShowDiscCodeError(true);
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        id='outlined-amount'
                        select
                        label='Discount Type *'
                        value={newDiscountCode?.type}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          textFieldOnChange(e, 'type');
                        }}
                      >
                        {discountCodeType.map((option) => (
                          <MenuItem key={option} value={option}>
                            {_.startCase(option.toLowerCase())}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        id='outlined-required'
                        label='Discount Amount *'
                        name='amount'
                        placeholder='e.g. 10'
                        type='number'
                        error={
                          validityCheck(newDiscountCode.amount?.toString()!) &&
                          showAmtError
                        }
                        helperText={
                          validityCheck(newDiscountCode.amount?.toString()!) &&
                          showAmtError
                            ? 'Please provide an amount for discount'
                            : ''
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              {newDiscountCode?.type ===
                              DiscountCodeType.FLAT_AMOUNT
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
                          textFieldOnChange(e, 'amount');
                          setShowAmtError(true);
                        }}
                        value={newDiscountCode?.amount}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        id='outlined-required'
                        label='Minimum Order Amount *'
                        name='minOrderAmount'
                        placeholder='e.g. 150'
                        type='number'
                        error={
                          validityCheck(
                            newDiscountCode.minOrderAmount?.toString()!
                          ) && showMinAmtError
                        }
                        helperText={
                          validityCheck(
                            newDiscountCode.minOrderAmount?.toString()!
                          ) && showMinAmtError
                            ? 'Please provide an minimum amount for discount to be applicable'
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
                          textFieldOnChange(e, 'minOrderAmount');
                          setShowMinAmtError(true);
                        }}
                        value={newDiscountCode?.minOrderAmount}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DiscountPeriodRadio
                        radioValue={radioValue}
                        handleRadioChange={handleRadioChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction='row' spacing={2}>
                        <DiscountDateRange
                          radioValue={radioValue}
                          newDiscountCode={newDiscountCode}
                          setNewDiscountCode={setNewDiscountCode}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </div>
              </div>

              <BottomButton
                location='discountCode/allDiscountCodes'
                firstButtonText='CANCEL'
                secondButtonText='CREATE'
                secondButtonFn={handleCreateButtonClick}
                discountCode={newDiscountCode}
              />
            </form>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default CreateNewDiscountCode;
