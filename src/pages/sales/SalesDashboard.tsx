import { Divider, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import DateRangePicker from 'src/components/common/DateRangePicker';
import NumberCard from 'src/components/common/NumberCard';
import { MomentRange, NOW, READABLE_DDMMYY } from 'src/utils/dateUtils';
import '../../styles/common/common.scss';

const SalesDashboard = () => {
  const [dateRange, setDateRange] = React.useState<MomentRange>([NOW, NOW]);

  return (
    <div className='inventory-dashboard'>
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>Sales Dashboard</h1>
        <Stack direction='row' spacing={3}>
          <Typography className='container-center'>View sales from</Typography>
          <DateRangePicker
            dateRange={dateRange}
            updateDateRange={setDateRange}
          />
        </Stack>
      </Stack>
      <Divider className='full-divider' />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h4>At a glance</h4>
        </Grid>
        <Grid item xs={6}>
          <NumberCard value={1000} text='Orders received' />
        </Grid>
        <Grid item xs={6}>
          <NumberCard
            value='$1,234,567.89'
            text={`Revenue earned from ${dateRange[0].format(
              READABLE_DDMMYY
            )} to ${dateRange[1].format(READABLE_DDMMYY)}`}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default SalesDashboard;
