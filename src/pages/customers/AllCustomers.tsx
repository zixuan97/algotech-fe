import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import AllCustomersCellAction from 'src/components/customers/AllCustomersCellAction';
import '../../styles/common/common.scss';
import '../../styles/pages/customer/customer.scss';
import { Stack, TextField, Typography } from '@mui/material';
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
      params.row.firstName
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    flex: 1
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1.3,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.email
  },
  {
    field: 'mobile',
    headerName: 'Mobile',
    flex: 0.7,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.contactNo
  },
  {
    field: 'lastOrderDate',
    headerName: 'Last Order Date',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      let date = params.row.lastOrderDate;
      let valueFormatted = moment(date).format('DD/MM/YYYY');
      return valueFormatted;
    }
  },
  {
    field: 'avgOrderValue',
    headerName: 'Avg. Order Value',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      "$" + (params.row.totalSpent/params.row.ordersCount).toFixed(2)
  },
  {
    field: 'totalOrderValue',
    headerName: 'Total Order Value',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      "$" + (params.row.totalSpent).toFixed(2)
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

const AllCustomers = () => {
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
        console.log(res);
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
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>All Customers</h1>
      </Stack>
      <div className='search-bar'>
          <Search />
          <TextField
            id='search'
            label='Search'
            margin='normal'
            placeholder='First Name, Last Name, Email or Mobile'
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
  );
};

export default AllCustomers;
