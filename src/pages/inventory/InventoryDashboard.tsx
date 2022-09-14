import { Button, Card, Divider, Tooltip, Typography } from '@mui/material';
import React from 'react';
import '../../styles/pages/inventory/inventoryDashboard.scss';
import '../../styles/common/common.scss';
import NumberCard from 'src/components/common/NumberCard';
import { Product, StockQuantity } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllProducts } from 'src/services/productService';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import ProductDashboardCellAction from 'src/components/inventory/ProductDashboardCellAction';
import { Bar } from 'react-chartjs-2';
import InventoryLevelsChart from 'src/components/inventory/InventoryTurnoverChart';
import { getHtml2Canvas } from 'src/utils/fileUtils';

const columns: GridColDef[] = [
  { field: 'sku', headerName: 'SKU', flex: 1 },
  { field: 'name', headerName: 'Product Name', flex: 1 },
  {
    field: 'stockQuantity',
    headerName: 'Quantity',
    type: 'number',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      return (
        params.value?.reduce(
          (prev: number, curr: StockQuantity) => prev + curr.quantity,
          0
        ) ?? 0
      );
    }
  },
  //   { last restock date },
  { field: 'qtyThreshold', headerName: 'Priority', type: 'number', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    flex: 2,
    renderCell: ProductDashboardCellAction
  }
];

const InventoryDashboard = () => {
  const pdfRef = React.createRef<HTMLDivElement>();
  const [productData, setProductData] = React.useState<Product[]>([]);

  const computeProductsWithLowStock = () => {
    let count = 0;
    productData.forEach((product) => {
      const { qtyThreshold, stockQuantity } = product;
      const totalQty = stockQuantity.reduce(
        (prev: number, curr: StockQuantity) => prev + curr.quantity,
        0
      );
      if (qtyThreshold && totalQty < qtyThreshold) {
        count++;
      }
    });
    return count;
  };

  const getGraphImage = React.useCallback(() => {
    console.log(pdfRef.current);
    if (pdfRef.current) {
      getHtml2Canvas(pdfRef.current, 'image.png');
    }
  }, [pdfRef]);

  React.useEffect(() => {
    asyncFetchCallback(getAllProducts(), setProductData);
  }, []);

  console.log(productData);

  return (
    <div className='inventory-dashboard'>
      <h1>Inventory Dashboard</h1>
      <Divider className='full-divider' />
      <h4>At a glance</h4>
      <div className='horizontal-inline-bar'>
        <NumberCard
          number={computeProductsWithLowStock()}
          text='Products with low stock levels'
        />
        {/* <NumberCard number={20} text='Days of supply left on average' /> */}
      </div>
      <Link
        to='/inventory/allProducts'
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Tooltip title='View all products' enterDelay={300}>
          <h4>Products</h4>
        </Tooltip>
      </Link>
      <div style={{ width: '100%' }}>
        <DataGrid
          sx={{ fontSize: '0.8em' }}
          columns={columns}
          rows={productData}
          autoHeight
          pageSize={5}
        />
      </div>
      {/* <h4>Overall Inventory Turnover</h4> */}
      <h4>Current Inventory Levels by Product</h4>
      <Button onClick={() => getGraphImage()}>Download</Button>
      <InventoryLevelsChart productData={productData} ref={pdfRef} />
    </div>
  );
};

export default InventoryDashboard;
