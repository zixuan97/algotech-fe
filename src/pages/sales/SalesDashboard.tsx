import { MoreVert } from '@mui/icons-material';
import { Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import DateRangePicker from 'src/components/common/DateRangePicker';
import NumberCard from 'src/components/common/NumberCard';
import BestsellerList from 'src/components/sales/dashboard/BestsellerList';
import OrdersCard from 'src/components/sales/dashboard/OrdersCard';
import PlatformPieChart from 'src/components/sales/dashboard/PlatformPieChart';
import RevenueChart from 'src/components/sales/dashboard/RevenueChart';
import SalesOrdersGrid from 'src/components/sales/dashboard/SalesOrdersGrid';
import inventoryContext from 'src/context/inventory/inventoryContext';
import { MomentRange, NOW, READABLE_DDMMYY } from 'src/utils/dateUtils';
import '../../styles/common/common.scss';

const SalesDashboard = () => {
  const { products } = React.useContext(inventoryContext);
  const [dateRange, setDateRange] = React.useState<MomentRange>([NOW, NOW]);

  const bestSellers = products.map((prd) => ({
    productName: prd.name,
    quantity: Math.floor(Math.random() * 1000) + 1
  }));

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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h4>At a glance</h4>
        </Grid>
        <Grid item xs={6}>
          <OrdersCard />
        </Grid>
        <Grid item xs={6}>
          <NumberCard
            value='$1,234,567.89'
            text={`Revenue earned from ${dateRange[0].format(
              READABLE_DDMMYY
            )} to ${dateRange[1].format(READABLE_DDMMYY)}`}
            component={
              <IconButton>
                <MoreVert />
              </IconButton>
            }
          />
        </Grid>
        <Grid item xs={6}>
          <RevenueChart />
        </Grid>
        <Grid item xs={3}>
          <BestsellerList bestsellers={bestSellers} />
        </Grid>
        <Grid item xs={3}>
          <PlatformPieChart />
        </Grid>
        <Grid item xs={12}>
          <Divider
            className='full-divider'
            sx={{ bgcolor: 'primary', borderBottomWidth: 3, margin: '0.5em 0' }}
          />
        </Grid>
        <Grid item xs={12}>
          <h3>Sales Orders</h3>
        </Grid>
        <Grid item xs={12}>
          <SalesOrdersGrid />
        </Grid>
      </Grid>
    </div>
  );
};

export default SalesDashboard;
