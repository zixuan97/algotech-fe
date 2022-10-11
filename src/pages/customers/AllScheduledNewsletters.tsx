import React from 'react';
import { useNavigate } from 'react-router';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import '../../styles/pages/customer/customer.scss';
import { Button, Stack, Typography } from '@mui/material';
import moment from 'moment';

const ScheduledNewsletters = () => {
  const navigate = useNavigate();

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
        <h1>Scheduled Newsletters</h1>
        <Stack direction='row' spacing={2}>
          <Typography className='date-picker-text'>
            View newsletters scheduled from
          </Typography>
          <DateRangePicker
            dateRange={dateRange}
            updateDateRange={setDateRange}
          />
        </Stack>
      </Stack>
      <div className='scheduled-newsletters-toolbar'>
        <Button
          variant='contained'
          size='medium'
          sx={{ height: 'fit-content' }}
          onClick={() => navigate({ pathname: '/customer/scheduleNewsletter' })}
        >
          Schedule Newsletter
        </Button>
      </div>
    </div>
  );
};

export default ScheduledNewsletters;
