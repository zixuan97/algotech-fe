import React from 'react';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import '../../styles/pages/customer/customer.scss';
import { Stack, Typography } from '@mui/material';
import moment from 'moment';

const SentNewsletters = () => {
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('month'),
    moment().endOf('day')
  ]);

  return (
    <div className='view-newsletters'>
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>Sent Newsletters</h1>
        <Stack direction='row' spacing={2}>
          <Typography className='date-picker-text'>
            View newsletters sent from
          </Typography>
          <DateRangePicker
            dateRange={dateRange}
            updateDateRange={setDateRange}
          />
        </Stack>
      </Stack>
    </div>
  );
};

export default SentNewsletters;
