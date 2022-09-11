import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AccountCellAction from 'src/components/account/AccountCellAction';
import '../../styles/pages/accounts.scss';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { User } from 'src/models/types';
import asyncFetchCallback from 'src/services/asyncFetchCallback';
import { getAllUserSvc } from 'src/services/account/accountService';

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
    headerAlign: 'center',
    flex: 1,
    renderCell: AccountCellAction
  }
];

const Accounts = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    asyncFetchCallback(
      getAllUserSvc(),
      (users: Array<User>) => {
        setUsers(users);
      },
      () => {
        //handle error here
      }
    )
  }, []);

  (
    !users && (
      <div>
        Loading ...
      </div>
    )
  )
  return (
    <div className='accounts'>
      <h1>User Accounts</h1>
      <Box>
        <Button
          type='submit'
          variant='contained'
          className='create-btn'
          color='primary'
          onClick={() => {
            navigate('/accounts/createNewUser');
          }}
        >
          Create New User
        </Button>
      </Box>
      <DataGrid columns={columns} rows={users} autoHeight />
    </div>
  );
};

export default Accounts;
