import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import BundleCellAction from '../../components/inventory/BundleCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Bundle } from '../../models/types';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { getAllBundles } from '../../services/bundleService';
import { useNavigate } from 'react-router';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Bundle Name', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: BundleCellAction
  }
];

const AllBundles = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [bundleData, setBundleData] = React.useState<Bundle[]>([]);
  const [filteredData, setFilteredData] = React.useState<Bundle[]>([]);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllBundles(),
      (res) => {
        setLoading(false);
        setBundleData(res);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? bundleData.filter((bundle) =>
            Object.values(bundle).some((value) =>
              String(value).toLowerCase().includes(searchField.toLowerCase())
            )
          )
        : bundleData
    );
  }, [searchField, bundleData]);

  console.log(filteredData);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  return (
    <div className='product-inventory'>
      <h1>All Bundles</h1>
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
          onClick={() => navigate({ pathname: '/inventory/createBundle' })}
        >
          Create Bundle
        </Button>
      </div>
      <DataGrid
        columns={columns}
        rows={filteredData}
        loading={loading}
        autoHeight
      />
    </div>
  );
};

export default AllBundles;
