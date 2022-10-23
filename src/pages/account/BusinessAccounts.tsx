import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import '../../styles/pages/accounts.scss';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { User, UserStatus } from 'src/models/types';
import { getAllB2BRequests } from 'src/services/accountService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { Search } from '@mui/icons-material';
import RequestCellAction from 'src/components/account/RequestCellAction';
import _, { filter } from 'lodash';

//TODO: Include avatar
const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First Name', flex: 1 },
  { field: 'lastName', headerName: 'Last Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'role', headerName: 'Type Of Account', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'center',
    flex: 1,
    renderCell: RequestCellAction
  }
];

let status = Object.keys(UserStatus).filter((v) => isNaN(Number(v)));
status.unshift('ALL');

const BusinessAccounts = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = React.useState<User[]>([]);
  const [searchField, setSearchField] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    setLoading(true);
    asyncFetchCallback(getAllB2BRequests(), (users: Array<User>) => {
      setUsers(users);
      setLoading(false);
    }, 
    () => setLoading(false));
  }, []);

  useEffect(() => {
    setFilteredData(
      searchField || filterStatus
        ? users.filter((user) => {
            if (filterStatus === 'ALL') {
              return Object.values(user).some((value) =>
                String(value).toLowerCase().includes(searchField.toLowerCase())
              );
            } else {
              return Object.values(user).some(
                (value) =>
                  String(value)
                    .toLowerCase()
                    .includes(searchField.toLowerCase()) &&
                  user.status === filterStatus
              );
            }
          })
        : users
    );
  }, [filterStatus, searchField, users]);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value);
  };

  !users && <div>Loading ...</div>;

  return (
    <div className='accounts'>
      <h1>B2B Accounts</h1>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <Search />
          <FormControl style={{ width: '50%' }}>
            <InputLabel id='search-platform'>Status</InputLabel>
            <Select
              id='search-status'
              value={filterStatus}
              label='Status'
              placeholder='Status'
              onChange={handleStatusChange}
            >
              {status.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            id='search'
            label='Search'
            margin='normal'
            fullWidth
            onChange={handleSearchFieldChange}
          />
        </div>
      </div>
      <DataGrid
        columns={columns}
        rows={filteredData}
        autoHeight
        loading={loading}
      />
    </div>
  );
};

export default BusinessAccounts;
