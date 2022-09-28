import { Download, FilterList, MoreVert, Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import moment from 'moment';
import React from 'react';
import DateRangePicker from 'src/components/common/DateRangePicker';
import NumberCard from 'src/components/common/NumberCard';
import BestsellerList from 'src/components/sales/dashboard/BestsellerList';
import OrdersCard from 'src/components/sales/dashboard/OrdersCard';
import PlatformPieChart from 'src/components/sales/dashboard/PlatformPieChart';
import RevenueChart from 'src/components/sales/dashboard/RevenueChart';
import SalesOrdersGrid from 'src/components/sales/dashboard/SalesOrdersGrid';
import {
  DailySales,
  PlatformType,
  SalesBestseller,
  SalesOrder,
  SalesRevenue
} from 'src/models/types';
import {
  getDailySalesByRangeSvc,
  getSalesBestsellersByRangeSvc,
  getSalesOrdersByRangeSvc,
  getSalesRevenueByRangeSvc
} from 'src/services/salesService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  DDMMYYYY,
  getTodayFormattedDate,
  MomentRange,
  READABLE_DDMMYY
} from 'src/utils/dateUtils';
import { createPdfFromComponent, downloadFile } from 'src/utils/fileUtils';
import '../../styles/common/common.scss';
import '../../styles/pages/sales/orders.scss';

const ALL_PLATFORMS = 'ALL';

const platforms = [
  ALL_PLATFORMS,
  ...Object.keys(PlatformType).filter((v) => isNaN(Number(v)))
];

const SalesDashboard = () => {
  const pdfRef = React.createRef<HTMLDivElement>();

  // data
  const [salesOrders, setSalesOrders] = React.useState<SalesOrder[]>([]);
  const [bestSellers, setBestSellers] = React.useState<SalesBestseller[]>([]);
  const [dailySales, setDailySales] = React.useState<DailySales[]>([]);
  const [revenue, setRevenue] = React.useState<SalesRevenue[]>([]);

  // component state
  const [pdfLoading, setPdfLoading] = React.useState<boolean>(false);
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('day'),
    moment().endOf('day')
  ]);

  // search fields
  const [searchField, setSearchField] = React.useState<string>('');
  const [searchPlatform, setSearchPlatform] = React.useState<string>(
    platforms[0]
  );

  const filteredSalesOrders = React.useMemo(
    () =>
      searchField || searchPlatform
        ? salesOrders.filter(
            (salesOrder) =>
              (searchPlatform === ALL_PLATFORMS ||
                salesOrder.platformType === searchPlatform) &&
              Object.values(salesOrder).some((value) =>
                String(value).toLowerCase().match(searchField.toLowerCase())
              )
          )
        : salesOrders,
    [searchField, searchPlatform, salesOrders]
  );

  React.useEffect(() => {
    asyncFetchCallback(getSalesOrdersByRangeSvc(dateRange), setSalesOrders);
    asyncFetchCallback(getSalesBestsellersByRangeSvc(dateRange), (res) => {
      const sortedBestsellers = res.sort((a, b) => b.quantity - a.quantity);
      setBestSellers(sortedBestsellers);
    });
    asyncFetchCallback(getDailySalesByRangeSvc(dateRange), (res) => {
      const sortedDailySales = res.sort((a, b) =>
        moment(a.createddate).diff(b.createddate)
      );
      setDailySales(sortedDailySales);
    });
    asyncFetchCallback(getSalesRevenueByRangeSvc(dateRange), (res) => {
      const sortedRevenue = res.sort((a, b) =>
        moment(a.createddate).diff(b.createddate)
      );
      setRevenue(sortedRevenue);
    });
  }, [dateRange]);

  const generateDashboardPdf = React.useCallback(async () => {
    setPdfLoading(true);
    if (pdfRef.current) {
      createPdfFromComponent(pdfRef.current, 'landscape')
        .then((pdf) => {
          downloadFile(
            pdf,
            `SalesDashboard-${getTodayFormattedDate(DDMMYYYY)}.pdf`
          );
          setPdfLoading(false);
        })
        .catch(() => setPdfLoading(false));
    }
  }, [pdfRef]);

  return (
    <div className='inventory-dashboard'>
      <div ref={pdfRef}>
        <Stack
          direction='row'
          width='100%'
          alignItems='center'
          justifyContent='space-between'
        >
          <h1>Sales Dashboard</h1>
          <Stack direction='row' spacing={3}>
            <Typography className='container-center'>
              View sales from
            </Typography>
            <DateRangePicker
              dateRange={dateRange}
              updateDateRange={setDateRange}
            />
            <LoadingButton
              loading={pdfLoading}
              loadingPosition='end'
              variant='contained'
              endIcon={<Download />}
              onClick={() => generateDashboardPdf()}
            >
              Export PDF
            </LoadingButton>
          </Stack>
        </Stack>
        <Divider className='full-divider' />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h4>At a glance</h4>
          </Grid>
          <Grid item xs={6}>
            <OrdersCard dailySales={dailySales} />
          </Grid>
          <Grid item xs={6}>
            <NumberCard
              value={`$${revenue
                .reduce((prev, curr) => prev + curr.revenue, 0)
                .toFixed(2)}`}
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
            <RevenueChart revenue={revenue} />
          </Grid>
          <Grid item xs={3}>
            <BestsellerList bestsellers={bestSellers} />
          </Grid>
          <Grid item xs={3}>
            <PlatformPieChart salesOrders={salesOrders} />
          </Grid>
          <Grid item xs={12}>
            <Divider
              className='full-divider'
              sx={{
                bgcolor: 'primary',
                borderBottomWidth: 3,
                margin: '0.5em 0'
              }}
            />
          </Grid>
        </Grid>
      </div>
      <div style={{ width: '100%', marginBottom: 10 }}>
        <h3>Sales Orders</h3>
        <div className='order-grid-toolbar'>
          <div className='search-bar'>
            <FilterList />
            <FormControl style={{ width: '50%' }}>
              <InputLabel id='search-platform'>Platform</InputLabel>
              <Select
                id='search-platform'
                value={searchPlatform}
                label='Platform'
                placeholder='Platform'
                onChange={(e) => setSearchPlatform(e.target.value)}
              >
                {platforms.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Search />
            <TextField
              id='search'
              label='Search'
              fullWidth
              value={searchField}
              placeholder='Input Search Field ...'
              onChange={(e) => setSearchField(e.target.value)}
            />
            <Button
              variant='contained'
              size='large'
              sx={{ height: 'fit-content' }}
              onClick={() => {
                setSearchField('');
                setSearchPlatform(platforms[0]);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
        <SalesOrdersGrid salesOrders={filteredSalesOrders} />
      </div>
    </div>
  );
};

export default SalesDashboard;
