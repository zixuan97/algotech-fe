import { Button, Divider, Tooltip } from '@mui/material';
import React from 'react';
import '../../styles/pages/inventory/inventoryDashboard.scss';
import '../../styles/common/common.scss';
import NumberCard from 'src/components/common/NumberCard';
import { StockQuantity } from 'src/models/types';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import ProductDashboardCellAction from 'src/components/inventory/ProductDashboardCellAction';
import InventoryLevelsChart from 'src/components/inventory/InventoryTurnoverChart';
import {
  createPdfFromComponent,
  downloadFile,
  getExcelFromApi
} from 'src/utils/fileUtils';
import StockPriorityCell from 'src/components/inventory/StockPriorityCell';
import DownloadIcon from '@mui/icons-material/Download';
import { DDMMYYYY, getTodayFormattedDate } from 'src/utils/dateUtils';
import inventoryContext from 'src/context/inventory/inventoryContext';
import apiRoot from 'src/services/util/apiRoot';

export enum StockPriorityType {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

const getTotalQty = (stockQty: StockQuantity[] | undefined) =>
  stockQty?.reduce(
    (prev: number, curr: StockQuantity) => prev + curr.quantity,
    0
  ) ?? 0;

const columns: GridColDef[] = [
  { field: 'sku', headerName: 'SKU', flex: 1 },
  { field: 'name', headerName: 'Product Name', flex: 2 },
  {
    field: 'stockQuantity',
    headerName: 'Quantity',
    type: 'number',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => getTotalQty(params.value)
  },
  //   { last restock date },
  {
    field: 'qtyThreshold',
    headerName: 'Priority',
    type: 'number',
    flex: 1,
    valueGetter: (params: GridValueGetterParams): StockPriorityType => {
      const { stockQuantity, qtyThreshold } = params.row;
      const totalQty = getTotalQty(stockQuantity);

      if (totalQty < qtyThreshold) {
        return StockPriorityType.HIGH;
      } else if (totalQty > qtyThreshold) {
        return StockPriorityType.LOW;
      } else {
        return StockPriorityType.MEDIUM;
      }
    },
    renderCell: StockPriorityCell,
    sortComparator: (a: StockPriorityType, b: StockPriorityType) => {
      return b - a;
    }
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    minWidth: 340,
    renderCell: ProductDashboardCellAction
  }
];

const InventoryDashboard = () => {
  const { products, refreshProducts } = React.useContext(inventoryContext);
  const pdfRef = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    const eventSource = new EventSource(`${apiRoot}/shopify/webhook`, {
      withCredentials: true
    });
    eventSource.onopen = () => console.log('eventsource opened');
    eventSource.onmessage = (e) => {
      console.log('receiving data');
      console.log(e.data);
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const computeProductsWithLowStock = () => {
    let count = 0;
    products.forEach((product) => {
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

  const generateChartPdf = React.useCallback(async () => {
    if (pdfRef.current) {
      const pdf = await createPdfFromComponent(
        pdfRef.current,
        'portrait',
        'Inventory Levels Chart'
      );
      downloadFile(
        pdf,
        `InventoryTurnover-${getTodayFormattedDate(DDMMYYYY)}.pdf`
      );
    }
  }, [pdfRef]);

  React.useEffect(() => {
    refreshProducts();
    //eslint-disable-next-line
  }, []);

  return (
    <div className='inventory-dashboard'>
      <h1>Inventory Dashboard</h1>
      <Divider className='full-divider' />
      <h4>At a glance</h4>
      <div className='horizontal-inline-bar'>
        <NumberCard
          value={computeProductsWithLowStock()}
          text='Products with low stock levels'
        />
        {/* <NumberCard number={20} text='Days of supply left on average' /> */}
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1%'
        }}
      >
        <Link
          to='/inventory/allProducts'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Tooltip title='View all products' enterDelay={300}>
            <h4>Products</h4>
          </Tooltip>
        </Link>
        <Button
          startIcon={<DownloadIcon />}
          variant='outlined'
          onClick={() =>
            getExcelFromApi(
              'POST',
              '/product/excel',
              `InventoryData-${getTodayFormattedDate(DDMMYYYY)}.xlsx`
            )
          }
        >
          Export Inventory Data
        </Button>
      </div>
      <div style={{ width: '100%' }}>
        <DataGrid
          sx={{ fontSize: '0.8em' }}
          columns={columns}
          rows={products}
          autoHeight
          pageSize={5}
        />
      </div>
      {/* <h4>Overall Inventory Turnover</h4> */}

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1%'
        }}
      >
        <h4>Current Inventory Levels by Product</h4>
        <Button
          startIcon={<DownloadIcon />}
          variant='outlined'
          onClick={() => generateChartPdf()}
        >
          Download Chart
        </Button>
      </div>
      <InventoryLevelsChart productData={products} ref={pdfRef} />
    </div>
  );
};

export default InventoryDashboard;
