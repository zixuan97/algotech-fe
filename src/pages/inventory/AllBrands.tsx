import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import BrandCellAction from 'src/components/inventory/BrandCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Brand } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllBrands } from 'src/services/productService';
import { useNavigate } from 'react-router';

const columns: GridColDef[] = [
  {field: 'id', headerName: 'Brand ID', flex:1},
  {field: 'name', headerName: 'Brand Name', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    flex: 1,
    renderCell: BrandCellAction
  }
];

const AllBrands = () => {

  const navigate = useNavigate();

  const [searchField, setSearchField] = React.useState<string>('');
  const [brandData, setBrandData] = React.useState<Brand[]>([]);
  const [filteredData, setFilteredData] = React.useState<Brand[]>([]);

  React.useEffect(() => {
    // TODO: implement error callback
    asyncFetchCallback(getAllBrands(), setBrandData);
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? brandData.filter((category) =>
            Object.values(category).some((value) =>
              String(value).toLowerCase().match(searchField.toLowerCase())
            )
          )
        : brandData
    );
  }, [searchField, brandData]);

  console.log(filteredData);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };

  return (
    <div className='product-inventory'>
      <h1>Manage Brands</h1>
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
          onClick={() => navigate({ pathname: '/inventory/createBrand' })}
        >
          Create Brand
        </Button>
      </div>
      <DataGrid columns={columns} rows={filteredData} autoHeight />
    </div>
  );

};

export default AllBrands;