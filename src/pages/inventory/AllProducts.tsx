import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ProductCellAction from 'src/components/inventory/ProductCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Product, StockQuantity, Brand } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllProducts } from 'src/services/productService';
import { useNavigate } from 'react-router';
import { getAllBrands, getBrandById } from 'src/services/brandService';

const columns = (brands: Brand[]): GridColDef[] => [
  { field: 'sku', headerName: 'SKU', flex: 1 },
  { field: 'name', headerName: 'Product Name', flex: 1 },
  {
    field: 'brand_id',
    headerName: 'Brand',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      brands.find((brand) => brand.id === params.value)?.name ?? ''
  },
  {
    field: 'productCategory',
    headerName: 'Category',
    flex: 2,
    valueGetter: (params: GridValueGetterParams) =>
      params.value
        .map((category: ProductCategory) => category.category_name)
        .join(', ')
  },
  {
    field: 'stockQuantity',
    headerName: 'Total Quantity',
    type: 'number',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.value?.reduce(
        (prev: number, curr: StockQuantity) => prev + curr.quantity,
        0
      ) ?? 0
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    flex: 1,
    renderCell: ProductCellAction
  }
];

const AllProducts = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [productData, setProductData] = React.useState<Product[]>([]);
  const [filteredData, setFilteredData] = React.useState<Product[]>([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getAllProducts(),
      (res) => {
        setLoading(false);
        setProductData(res);
      },
      () => setLoading(false)
    );
    asyncFetchCallback(getAllBrands(), setBrands);
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? productData.filter((product) =>
            Object.values(product).some((value) =>
              String(value).toLowerCase().match(searchField.toLowerCase())
            )
          )
        : productData
    );
  }, [searchField, productData]);

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
        columns={columns(brands)}
        rows={filteredData}
        loading={loading}
        autoHeight
      />
    </div>
  );
};

export default AllProducts;
