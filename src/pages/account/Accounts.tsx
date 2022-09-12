import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AccountCellAction from 'src/components/account/AccountCellAction';
import '../../styles/pages/accounts.scss';
import { Box } from '@mui/system';
import { Button, TextField } from '@mui/material';
import { User } from 'src/models/types';
import { getAllUserSvc } from 'src/services/account/accountService';
import asyncFetchCallback from '../../../src/services/util/asyncFetchCallback';
import { Search } from '@mui/icons-material';

//TODO: Include avatar
const columns: GridColDef[] = [
  { field: 'id', headerName: 'User ID', flex: 1 },
  { field: 'first_name', headerName: 'First Name', flex: 1 },
  { field: 'last_name', headerName: 'Last Name', flex: 1 },
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
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = React.useState<User[]>([]);
  const [searchField, setSearchField] = React.useState<string>('');

  useEffect(() => {
    asyncFetchCallback(
      getAllUserSvc(),
      (users: Array<User>) => {
        setUsers(users);
      },
      () => {
        //handle error here
      }
    );
  }, []);

  useEffect(() => {
    setFilteredData(
      searchField
        ? users.filter((user) =>
            Object.values(user).some((value) =>
              String(value).toLowerCase().match(searchField.toLowerCase())
            )
          )
        : users
    );
  }, [searchField, users]);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };

  !users && <div>Loading ...</div>;

  return (
    <div className='accounts'>
      <h1>User Accounts</h1>
      <div className='grid-toolbar'>
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
        <Button
          variant='contained'
          size='large'
          sx={{ height: 'fit-content' }}
          onClick={() => {
            navigate('/accounts/createNewUser');
          }}
        >
          Create New User
        </Button>
      </div>
      <DataGrid columns={columns} rows={filteredData} autoHeight />
    </div>
  );
};

export default Accounts;
