import { TextField, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { MomentRange, YYYY_MM_DD } from 'src/utils/dateUtils';

type DateRangePickerProps = {
  dateRange: MomentRange;
  updateDateRange: (newRange: (oldRange: MomentRange) => MomentRange) => void;
};

const DateRangePicker = ({
  dateRange,
  updateDateRange
}: DateRangePickerProps) => {
  return (
    <>
      <TextField
        id='start-date'
        label='Start Date'
        type='date'
        defaultValue={dateRange[0].format(YYYY_MM_DD)}
        sx={{ width: 220 }}
        onChange={(e) =>
          updateDateRange((prev) => [moment(e.target.value), prev[1]])
        }
        InputLabelProps={{
          shrink: true
        }}
      />
      <Typography className='container-center'>to</Typography>
      <TextField
        id='end-date'
        label='End Date'
        type='date'
        defaultValue={dateRange[1].format(YYYY_MM_DD)}
        sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true
        }}
      />
    </>
  );
};

export default DateRangePicker;
