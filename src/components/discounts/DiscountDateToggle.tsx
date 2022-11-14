import { DesktopDatePicker } from '@mui/x-date-pickers';
import { Grid, Stack, TextField } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DiscountCode } from 'src/models/types';
import { MomentRange, YYYY_MM_DD } from 'src/utils/dateUtils';
import DateRangePicker from '../common/DateRangePicker';
import DiscountPeriodRadio from './DiscountPeriodRadio';

interface props {
  editDiscountCode: DiscountCode;
  dateRange: MomentRange;
  setDateRange: (newRange: (oldRange: MomentRange) => MomentRange) => void;
}

const DiscountDateToggle = ({
  editDiscountCode,
  dateRange,
  setDateRange
}: props) => {
  const [radioValue, setRadioValue] = useState<string>(
    dateRange[1].isValid() ? 'fixed' : 'recurring'
  );
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
  };

  useEffect(() => {
    if (radioValue === 'recurring') {
      setDateRange((prev) => [prev[0], moment(null)]);
    }
  }, [radioValue, setDateRange]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DiscountPeriodRadio
            radioValue={radioValue}
            handleRadioChange={handleRadioChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction='row' spacing={2}>
            {radioValue === 'fixed' ? (
              <DateRangePicker
                dateRange={dateRange}
                updateDateRange={setDateRange}
                canSelectPastDate={true}
              />
            ) : (
              <DesktopDatePicker
                label='Start Date'
                value={moment(editDiscountCode?.startDate).format(YYYY_MM_DD)}
                minDate={moment('2000-01-01')}
                shouldDisableDate={(date) =>
                  moment(date).isBefore(moment().startOf('day'))
                }
                onChange={(date) => {
                  setDateRange((prev) => [
                    moment(date).startOf('day'),
                    prev[1]
                  ]);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default DiscountDateToggle;
