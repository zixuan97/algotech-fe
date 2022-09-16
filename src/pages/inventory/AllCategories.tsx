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

  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [categoryData, setCategoryData] = React.useState<Category[]>([]);
  const [filteredData, setFilteredData] = React.useState<Category[]>([]);

  React.useEffect(() => {
    // TODO: implement error callback
    // to do; write the categoryServices ts... vv this is WRONG
    // asyncFetchCallback(getAllProductCategories(), setCategoryData);
    setLoading(true);
    asyncFetchCallback(
      getAllProductCategories(),
      (res) =>  {
        setLoading(false);
        setCategoryData(res);
      },
      () => setLoading(false)
      );
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
      <DataGrid
        columns={columns}
        rows={filteredData}
        loading={loading}
        autoHeight />
    </div>
  );
};

export default AllCategories;