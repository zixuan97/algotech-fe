import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ProductCellAction from 'src/components/inventory/ProductCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Product, StockQuantity, Category } from '../../models/types';
import { useNavigate } from 'react-router';
import inventoryContext from 'src/context/inventory/inventoryContext';

const columns: GridColDef[] = [
  { field: 'sku', headerName: 'SKU', flex: 1 },
  { field: 'name', headerName: 'Product Name', flex: 1 },
  {
    field: 'brand',
    headerName: 'Brand',
    flex: 1,
    valueGetter: (params) => params.value.name
  },
  {
    field: 'categories',
    headerName: 'Category',
    flex: 2,
    valueGetter: (params) =>
      params.value.map((category: Category) => category.name).join(', ')
  },
  {
    field: 'stockQuantity',
    headerName: 'Total Quantity',
    type: 'number',
    flex: 1,
    valueGetter: (params) =>
      params.value?.reduce(
        (prev: number, curr: StockQuantity) => prev + curr.quantity,
        0
      ) ?? 0
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: ProductCellAction
  }
];

const AllProducts = () => {
  const navigate = useNavigate();
  const { products, refreshProducts } = React.useContext(inventoryContext);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [filteredData, setFilteredData] = React.useState<Product[]>([]);

  React.useEffect(() => {
    refreshProducts();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? products.filter((product) =>
            Object.values(product).some((value) =>
              String(value).toLowerCase().match(searchField.toLowerCase())
            )
          )
        : products
    );
  }, [searchField, products]);

  console.log(filteredData);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  return (
    <div className='product-inventory'>
      <h1>Product Inventory</h1>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <Search />
          <TextField
            id='search'
            label='Search'
            margin='normal'
            fullWidth
            placeholder='SKU, Product Name'
            onChange={handleSearchFieldChange}
          />
        </div>
        <Button
          variant='contained'
          size='large'
          sx={{ height: 'fit-content' }}
          onClick={() => navigate({ pathname: '/inventory/createProduct' })}
        >
          Create Product
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

export default AllProducts;
