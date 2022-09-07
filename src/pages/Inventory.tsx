import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ProductCellAction from 'src/components/inventory/ProductCellAction';
import '../styles/pages/inventory.scss';

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

const data = [
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
  return (
    <div className='product-inventory'>
      <h1>Product Inventory</h1>
      <DataGrid columns={columns} rows={data} autoHeight />
    </div>
  );
};

export default Inventory;
