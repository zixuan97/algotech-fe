import { Button, Divider, Tooltip } from '@mui/material';
import React from 'react';
import '../../styles/pages/inventory/inventoryDashboard.scss';
import '../../styles/common/common.scss';
import NumberCard from 'src/components/common/NumberCard';
import { Product, StockQuantity } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { generateExcelSvc, getAllProducts } from 'src/services/productService';
import {
  DataGrid,
  GridColDef,
  GridRowTreeNodeConfig,
  GridSortCellParams,
  GridValueGetterParams
} from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import ProductDashboardCellAction from 'src/components/inventory/ProductDashboardCellAction';
import InventoryLevelsChart from 'src/components/inventory/InventoryTurnoverChart';
import {
  createPdfWithHeaderImage,
  downloadFile,
  createImageFromComponent
} from 'src/utils/fileUtils';
import apiRoot from '../../services/util/apiRoot';
import StockPriorityCell from 'src/components/inventory/StockPriorityCell';
import DownloadIcon from '@mui/icons-material/Download';

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

const columns = (productData: Product[]): GridColDef[] => [
  { field: 'sku', headerName: 'SKU', flex: 1 },
  { field: 'name', headerName: 'Product Name', flex: 1 },
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
      return a - b;
    }
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    flex: 1,
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

  const generateInventoryExcel = () => {
    asyncFetchCallback(generateExcelSvc(), (res) => {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', `${apiRoot}/product/excel`, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
        if (this.status == 200) {
          var blob = new Blob([this.response], {
            type: 'application/octet-stream'
          });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Invoice.xlsx';
          link.click();
        }
      };
      xhr.send();
    });
  };

  const generateChartPdf = React.useCallback(async () => {
    if (pdfRef.current) {
      const fileName = 'inventory-chart-levels.pdf';
      const pdf = createPdfWithHeaderImage(
        'Inventory Levels Chart',
        await createImageFromComponent(pdfRef.current)
      );
      downloadFile(pdf, fileName);
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
          onClick={() => generateInventoryExcel()}
        >
          Export Inventory Data
        </Button>
      </div>
      <div style={{ width: '100%' }}>
        <DataGrid
          sx={{ fontSize: '0.8em' }}
          columns={columns(productData)}
          rows={productData}
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
      <InventoryLevelsChart productData={productData} ref={pdfRef} />
    </div>
  );
};

export default InventoryDashboard;
