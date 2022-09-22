import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import BrandCellAction from '../../components/inventory/BrandCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Brand } from '../../models/types';
import { useNavigate } from 'react-router';
import inventoryContext from 'src/context/inventory/inventoryContext';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Brand Name', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: BrandCellAction
  }
];

const AllBrands = () => {
  const navigate = useNavigate();
  const { brands, refreshBrands } = React.useContext(inventoryContext);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');

  React.useEffect(() => {
    setLoading(true);
    refreshBrands(() => setLoading(false));
  }, []);

  const filteredData = React.useMemo(
    () =>
      searchField
        ? brands.filter((brand) => 
          Object.values(brand).some((value) =>
            String(value).toLowerCase().match(searchField.toLowerCase())
          )
        )
      : brands,
    [searchField, brands]
  );

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
      <DataGrid
        columns={columns}
        rows={filteredData}
        loading={loading}
        autoHeight
      />
    </div>
  );
};

export default AllBrands;
