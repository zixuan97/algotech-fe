import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import AllCustomersCellAction from 'src/components/customers/AllCustomersCellAction';
import '../../styles/common/common.scss';
import '../../styles/pages/delivery/map.scss';
import '../../styles/pages/delivery/delivery.scss';
import '../../styles/pages/customer/customer.scss';
import {
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { Customer } from '../../models/types';
import { getAllCustomers } from 'src/services/customerService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { useNavigate } from 'react-router';
import moment from 'moment';

const columns: GridColDef[] = [
  {
    field: 'firstName',
    headerName: 'First Name',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salesOrder.orderId
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    flex: 1
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1.5,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salesOrder.customerAddress
  },
  {
    field: 'mobile',
    headerName: 'Mobile',
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salesOrder.customerAddress
  },
  {
    field: 'lastOrderDate',
    headerName: 'Last Order Date',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      let date = params.value;
      let valueFormatted = moment(date).format('DD/MM/YYYY');
      return valueFormatted;
    }
  },
  {
    field: 'avgOrderValue',
    headerName: 'Avg. Order Value',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salesOrder.customerAddress
  },
  {
    field: 'totalOrderValue',
    headerName: 'Total Order Value',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salesOrder.customerAddress
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: AllCustomersCellAction
  }
];

const CustomerDetails = () => {
  const navigate = useNavigate();

  const [customerData, setCustomerData] = React.useState<Customer[]>([]);
  const [filteredData, setFilteredData] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? customerData.filter((category) =>
            Object.values(category).some((value) =>
              String(value).toLowerCase().includes(searchField.toLowerCase())
            )
          )
        : customerData
    );
  }, [searchField, customerData]);

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getAllCustomers(),
      (res) => {
        setLoading(false);
        setCustomerData(res);
      },
      () => setLoading(false)
    );
  }, []);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // here
    setSearchField(e.target.value);
  };

  return (
    <div className='all-customers'>
      <div className='customer-cards'>
        <Paper elevation={2} className='customer-details-card'>
          <div className='customer-details-grid'>
            <h2 className='labelText'>Customer Details</h2>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h4 className='labelText'>First Name</h4>
                <Typography>
                  {/* {originalDeliveryOrder?.salesOrder.customerName} */}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Last Name</h4>
                <Typography>
                  {/* {originalDeliveryOrder?.salesOrder.customerName} */}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <h4 className='labelText'>Email</h4>
                <Typography>
                  {/* {originalDeliveryOrder?.salesOrder.customerAddress} */}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <h4 className='labelText'>Mobile Number</h4>
                <Typography>
                  {/* {originalDeliveryOrder?.salesOrder.customerAddress} */}
                </Typography>
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
                {/* <Typography>
                  {moment(originalDeliveryOrder?.deliveryDate).format(
                    'DD/MM/YYYY'
                  )}
                </Typography> */}
              </Grid>
              <Grid item xs={12}>
                <h4 className='labelText'>Average Order Amount</h4>
                <Typography>
                  {/* {originalDeliveryOrder?.shippingType} */}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <h4 className='labelText'>Total Order Amount</h4>
                <Typography>
                  {/* {originalDeliveryOrder?.shippingType} */}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </div>
      <div className='orders-table'>
        <Stack
          direction='row'
          width='100%'
          alignItems='center'
          justifyContent='space-between'
        >
          <h2>Customer's Orders</h2>
        </Stack>
        <div className='search-bar'>
          <Search />
          <TextField
            id='search'
            label='Search'
            margin='normal'
            fullWidth
            onChange={handleSearchFieldChange}
          />
        </div>
        <div className='data-grid-container'>
          <DataGrid
            columns={columns}
            rows={filteredData}
            autoHeight
            loading={loading}
          />
        </div>
      </div>
      <div className='newsletter-table'>
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
      </div>
    </div>
  );
};

export default CustomerDetails;
