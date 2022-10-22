import React, { useMemo, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import '../../styles/common/common.scss';
import '../../styles/pages/delivery/map.scss';
import '../../styles/pages/delivery/delivery.scss';
import '../../styles/pages/customer/customer.scss';
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { ChevronLeft, Download, FilterList, Search } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Customer, PlatformType, BulkOrderStatus } from '../../models/types';
import { bulkOrderColumns } from 'src/components/customers/CustomerBulkOrderGrid';
import { getCustomerById } from 'src/services/customerService';
import CustomerOrderTable from 'src/components/customers/CustomerOrdersTable';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import moment from 'moment';
import _, { values } from 'lodash';
import OrdersChart from 'src/components/customers/OrdersChart';
import { getExcelFromApi } from 'src/utils/fileUtils';
import { DDMMYYYY, getTodayFormattedDate } from 'src/utils/dateUtils';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';

let platforms = Object.keys(PlatformType).filter((v) => isNaN(Number(v)));
platforms.unshift('ALL');

let orderStatus = Object.keys(BulkOrderStatus)
  .filter((v) => isNaN(Number(v)))
  .map((status) => {
    return _.startCase(status);
  });
orderStatus.unshift('ALL');


const CustomerDetails = () => {

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  const [customerData, setCustomerData] = React.useState<Customer>();
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>('ALL');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [searchBulkOrderField, setSearchBulkOrderField] =
    React.useState<string>('');

  const filteredData = useMemo(
    () =>
      filterPlatform || searchField
        ? customerData?.salesOrders.filter((saleOrder) => {
          const searchFieldLower = searchField.toLowerCase().trim();
          if (filterPlatform === 'ALL') {
            return (
              saleOrder.customerAddress
                .toLowerCase()
                .includes(searchFieldLower) ||
              saleOrder.orderId.toLowerCase().includes(searchFieldLower) ||
              saleOrder.salesOrderItems.some((item) =>
                item.productName?.toLowerCase().includes(searchFieldLower)
              ) ||
              _.startCase(saleOrder.orderStatus)
                .toLowerCase()
                .includes(searchFieldLower)
            );
          } else {
            return (
              saleOrder.platformType === filterPlatform &&
              (saleOrder.customerAddress
                .toLowerCase()
                .includes(searchFieldLower) ||
                saleOrder.orderId.toLowerCase().includes(searchFieldLower) ||
                saleOrder.salesOrderItems.some((item) =>
                  item.productName?.toLowerCase().includes(searchFieldLower)
                ) ||
                _.startCase(saleOrder.orderStatus)
                  .toLowerCase()
                  .includes(searchFieldLower))
            );
          }
        })
        : customerData?.salesOrders,
    [customerData?.salesOrders, filterPlatform, searchField]
  );

  const filteredBulkOrderData = useMemo(
    () =>
      filterOrderStatus || searchBulkOrderField
        ? customerData?.bulkOrders.filter((bulkOrder) => {
          const searchFieldLower = searchBulkOrderField.toLowerCase().trim();
          if (filterOrderStatus === 'ALL') {
            return (
              bulkOrder.paymentMode
                .toLowerCase()
                .includes(searchFieldLower) ||
              _.startCase(bulkOrder.bulkOrderStatus)
                .toLowerCase()
                .includes(searchFieldLower)
            );
          } else {
            return (
              bulkOrder.bulkOrderStatus === filterOrderStatus &&
              (bulkOrder.paymentMode
                .toLowerCase()
                .includes(searchFieldLower) ||
                _.startCase(bulkOrder.bulkOrderStatus)
                  .toLowerCase()
                  .includes(searchFieldLower))
            );
          }
        })
        : customerData?.bulkOrders,
    [customerData?.bulkOrders, filterOrderStatus, searchBulkOrderField]
  );

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getCustomerById(id),
      (res) => {
        setLoading(false);
        setCustomerData(res);
        console.log(res);
      },
      () => {
        setAlert({
          severity: 'error',
          message:
            'User does not exist. You will be redirected back to the B2B Accounts page.'
        });
        setLoading(false);
        setTimeout(() => navigate(-1), 3500);
      }
    );
  }, [id]);

  console.log(customerData?.ordersByMonth);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // here
    setSearchField(e.target.value);
  };

  const handleBulkOrderSearchFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // here
    setSearchBulkOrderField(e.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterPlatform(event.target.value);
  };

  const handleFilterOrderChange = (event: SelectChangeEvent) => {
    setFilterOrderStatus(event.target.value);
  };

  return (
    <div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Tooltip title='Return to Previous Page' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate(-1)}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>

      <div className='all-customers'>
        <div className='customers-details'>
          <h1>Customer Details</h1>
          {loading && <CircularProgress color='secondary' />}
        </div>
        <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
        <div className='customer-cards'>
          <Paper elevation={2} className='customer-details-card'>
            <div className='customer-details-grid'>
              <h2 className='labelText'>Customer Information</h2>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <h4 className='labelText'>First Name</h4>
                  <Typography>{customerData?.firstName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <h4 className='labelText'>Last Name</h4>
                  <Typography>{customerData?.lastName}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <h4 className='labelText'>Email</h4>
                  <Typography>{customerData?.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <h4 className='labelText'>Mobile Number</h4>
                  <Typography>{customerData?.contactNo}</Typography>
                </Grid>
              </Grid>
            </div>
          </Paper>
          <Paper elevation={2} className='order-overview-card'>
            <div className='order-overview-grid'>
              <h2 className='labelText'>Customer Order Overview</h2>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <h4 className='labelText'>Last Order Date</h4>
                  <Typography>
                    {moment(customerData?.lastOrderDate).format('DD/MM/YYYY')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <h4 className='labelText'>Total Number of Orders</h4>
                  <Typography>{customerData?.ordersCount}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <h4 className='labelText'>Average Order Amount</h4>
                  {customerData?.totalSpent && customerData.ordersCount && (
                    <Typography>
                      $
                      {(
                        customerData!.totalSpent / customerData!.ordersCount
                      ).toFixed(2)}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <h4 className='labelText'>Total Order Amount</h4>
                  {customerData?.totalSpent && (
                    <Typography>
                      ${(customerData?.totalSpent).toFixed(2)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </div>
          </Paper>
        </div>
        <br></br>
        {!!customerData?.salesOrders?.length && (
          <div className='orders-chart'>
            {customerData?.ordersByMonth && (
              <Grid item xs={6}>
                <OrdersChart values={customerData?.ordersByMonth} />
              </Grid>
            )}
          </div>
        )}
        {!!customerData?.bulkOrders?.length && (
          <div className='orders-chart'>
            {customerData?.bulkOrdersByMonth && (
              <Grid item xs={6}>
                <OrdersChart values={customerData?.bulkOrdersByMonth} />
              </Grid>
            )}
          </div>
        )}
        {!!customerData?.salesOrders?.length && (
          <div className='orders-table'>
            <Stack
              direction='row'
              width='100%'
              alignItems='center'
              justifyContent='space-between'
            >
              <h2>Customer Orders</h2>
            </Stack>
            <div className='order-grid-toolbar'>
              <div className='search-bar'>
                <FilterList />
                <FormControl style={{ width: '50%' }}>
                  <InputLabel id='search-platform'>Platform</InputLabel>
                  <Select
                    id='search-platform'
                    value={filterPlatform}
                    label='Platform'
                    placeholder='Platform'
                    onChange={handleFilterChange}
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
                  placeholder='Address, OrderId, Product Name, Status'
                  onChange={handleSearchFieldChange}
                />
                <Button
                  variant='contained'
                  size='large'
                  sx={{ height: 'fit-content' }}
                  onClick={() => {
                    setSearchField('');
                    setFilterPlatform('ALL');
                  }}
                >
                  Reset
                </Button>
              </div>
              <Button
                variant='contained'
                size='large'
                sx={{ mr: 2 }}
                endIcon={<Download />}
                onClick={() => {
                  const reqBody = { customerEmail: customerData?.email };
                  getExcelFromApi(
                    'POST',
                    '/customer/excel',
                    `CustomerOrderData-${getTodayFormattedDate(DDMMYYYY)}.xlsx`,
                    reqBody
                  );
                }}
              >
                Export Customer Orders
              </Button>
            </div>
            <div className='data-grid-container'>
              {filteredData && <CustomerOrderTable filteredData={filteredData} />}
            </div>
          </div>
        )}
        {!!customerData?.bulkOrders?.length && (
          <div className='orders-table'>
            <Stack
              direction='row'
              width='100%'
              alignItems='center'
              justifyContent='space-between'
            >
              <h2>Customer Bulk Orders</h2>
            </Stack>
            <div className='order-grid-toolbar'>
              <div className='search-bar'>
                <FilterList />
                <FormControl style={{ width: '50%' }}>
                  <InputLabel id='search-platform'>Order Status</InputLabel>
                  <Select
                    id='search-platform'
                    value={filterOrderStatus}
                    label='Order Status'
                    placeholder='Order Station'
                    onChange={handleFilterOrderChange}
                  >
                    {orderStatus.map((option) => (
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
                  value={searchBulkOrderField}
                  placeholder='Payment Mode, Order Status'
                  onChange={handleBulkOrderSearchFieldChange}
                />
                <Button
                  variant='contained'
                  size='large'
                  sx={{ height: 'fit-content' }}
                  onClick={() => {
                    setSearchBulkOrderField('');
                    setFilterOrderStatus('ALL');
                  }}
                >
                  Reset
                </Button>
              </div>
              <Button
                variant='contained'
                size='large'
                sx={{ mr: 2 }}
                endIcon={<Download />}
                onClick={() => {
                  const reqBody = { payeeEmail: customerData?.email };
                  console.log(reqBody);
                  getExcelFromApi(
                    'POST',
                    '/bulkOrder/excel',
                    `CustomerBulkOrderData-${getTodayFormattedDate(DDMMYYYY)}.xlsx`,
                    reqBody
                  );
                }}
              >
                Export Customer Bulk Orders
              </Button>
            </div>
            {filteredBulkOrderData && (
              <DataGrid
                columns={bulkOrderColumns}
                rows={filteredBulkOrderData}
                autoHeight
                loading={loading}
              />
            )}
          </div>
        )}
        {/* <div className='newsletter-table'>
        <Stack
          direction='row'
          width='100%'
          alignItems='center'
          justifyContent='space-between'
        >
          <h2>Customer's Newletters</h2>
        </Stack>
        <div className='data-grid-container-newsletter'>
          <DataGrid
            columns={columns}
            rows={filteredData}
            autoHeight
            loading={loading}
          />
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default CustomerDetails;
