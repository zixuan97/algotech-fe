import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AccountCellAction from 'src/components/account/AccountCellAction';
import '../../styles/pages/accounts.scss';

//TODO: Include avatar
const columns: GridColDef[] = [
  { field: 'id', headerName: 'User ID', flex: 1 },
  { field: 'firstName', headerName: 'First Name', flex: 1 },
  { field: 'lastName', headerName: 'Last Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'role', headerName: 'Role', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    flex: 1,
    renderCell: AccountCellAction
  }
];

const data = [
  {
    id: 12345,
    firstName: 'Zi Xuan',
    lastName: 'Ng',
    email: 'zixuan@gmail.com',
    role: 'Admin'
  },
  {
    id: 67890,
    firstName: 'Leonard',
    lastName: 'Lee',
    email: 'leeleonard@gmail.com',
    role: 'Admin'
  },
];

const Accounts = () => {
  return (
    <div className='accounts'>
      <h1>User Accounts</h1>
      <DataGrid columns={columns} rows={data} autoHeight />
    </div>
  );
};

export default Accounts;
