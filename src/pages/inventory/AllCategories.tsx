import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CategoryCellAction from '../../components/inventory/CategoryCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Category } from '../../models/types';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { getAllProductCategories } from '../../services/productService';
import { useNavigate } from 'react-router';

const columns: GridColDef[] = [
  {field: 'id', headerName: 'Category ID', flex:1},
  {field: 'name', headerName: 'Category Name', flex:1},
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: CategoryCellAction
  }
];

const AllCategories = () => {
  const navigate = useNavigate();

  const [searchField, setSearchField] = React.useState<string>('');
  const [categoryData, setCategoryData] = React.useState<Category[]>([]);
  const [filteredData, setFilteredData] = React.useState<Category[]>([]);

  React.useEffect(() => {
    // TODO: implement error callback
    // to do; write the categoryServices ts... vv this is WRONG
    asyncFetchCallback(getAllProductCategories(), setCategoryData);
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? categoryData.filter((category) =>
            Object.values(category).some((value) =>
              String(value).toLowerCase().match(searchField.toLowerCase())
            )
          )
        : categoryData
    );
  }, [searchField, categoryData]);

  console.log(filteredData);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  return (
    <div className='product-inventory'>
      <h1>Manage Categories</h1>
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
          onClick={() => navigate({ pathname: '/inventory/createCategory' })}
        >
          Create Category
        </Button>
      </div>
      <DataGrid columns={columns} rows={filteredData} autoHeight />
    </div>
  );
};

export default AllCategories;