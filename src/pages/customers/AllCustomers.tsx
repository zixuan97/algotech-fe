import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import AllCustomersCellAction from 'src/components/customers/AllCustomersCellAction';
import '../../styles/common/common.scss';
import '../../styles/pages/customer/customer.scss';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Customer } from '../../models/types';
import { getAllCustomers } from 'src/services/customerService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import moment from 'moment';
import FilterCustomersMenu from 'src/components/customers/FilterCustomersMenu';

const columns: GridColDef[] = [
  {
    field: 'firstName',
    headerName: 'First Name',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.firstName
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
    valueGetter: (params: GridValueGetterParams) => params.row.email
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
    field: 'totalSpent',
    headerName: 'All Time Order Value',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      '$' + params.row.totalSpent.toFixed(2)
  },
  {
    field: 'avgOrderValue',
    headerName: 'Avg. Order Value',
    flex: 0.8,
    valueGetter: (params: GridValueGetterParams) =>
      '$' + (params.row.totalSpent / params.row.ordersCount).toFixed(2)
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    renderCell: AllCustomersCellAction
  }
];

const AllCustomers = () => {
  const [filteredData, setFilteredData] = React.useState<Customer[]>([]);
  const [searchFilteredData, setSearchFilteredData] = React.useState<
    Customer[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');

  React.useEffect(() => {
    setSearchFilteredData(
      searchField
        ? filteredData.filter((category) =>
            Object.values(category).some((value) =>
              String(value).toLowerCase().includes(searchField.toLowerCase())
            )
          )
        : filteredData
    );
  }, [searchField, filteredData]);

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getAllCustomers(),
      (res) => {
        setFilteredData(res);
        setSearchFilteredData(res);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };

  const getFilteredCustomers = (customers: Customer[]) => {
    setFilteredData(customers);
  };

  return (
    <div className='all-customers'>
      <h1>All Customers</h1>
      <div className='all-customers-toolbar'>
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
        <FilterCustomersMenu updateCustomers={getFilteredCustomers} />
      </div>
      <DataGrid
        columns={columns}
        rows={searchFilteredData}
        autoHeight
        loading={loading}
      />
    </div>
  );
};

export default AllCustomers;
