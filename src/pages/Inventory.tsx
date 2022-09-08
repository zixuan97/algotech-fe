import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ProductCellAction from 'src/components/inventory/ProductCellAction';
import '../styles/pages/inventory.scss';
import '../styles/common/common.scss';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Product } from '../models/types';

const columns: GridColDef[] = [
  { field: 'sku', headerName: 'SKU', flex: 1 },
  { field: 'category', headerName: 'Category', flex: 1 },
  { field: 'name', headerName: 'Product Name', flex: 1 },
  { field: 'quantity', headerName: 'Quantity', type: 'number', flex: 1 },
  { field: 'price', headerName: 'Price', type: 'number', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    flex: 1,
    renderCell: ProductCellAction
  }
];

type MockProduct = {
  id: number;
  sku: string;
  category: string;
  name: string;
  price: number;
  quantity: number;
};

const data: MockProduct[] = [
  {
    id: 1,
    sku: '12345',
    category: 'Popcorn',
    name: 'Nasi Lemak',
    price: 4.5,
    quantity: 100
  },
  {
    id: 2,
    sku: '67890',
    category: 'Popcorn',
    name: 'Kaya Toast',
    price: 4.5,
    quantity: 100
  },
  {
    id: 3,
    sku: '09871',
    category: 'Popcorn',
    name: 'Chicken Floss',
    price: 4.5,
    quantity: 100
  }
];

const Inventory = () => {
  const [searchField, setSearchField] = React.useState<string>('');
  const [productData, setProductData] = React.useState<MockProduct[]>([]);
  const [filteredData, setFilteredData] = React.useState<MockProduct[]>([]);

  React.useEffect(() => {
    setProductData(data);
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
      <DataGrid columns={columns} rows={filteredData} autoHeight />
    </div>
  );
};

export default Inventory;
