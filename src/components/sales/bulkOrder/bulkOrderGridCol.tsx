import { GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import '../../../styles/common/actionCells.scss';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import _ from 'lodash';

export const BulkOrderCellAction = ({ id }: GridRenderCellParams) => {
  const navigate = useNavigate();
  const navToViewBulkOrder = (edit: boolean) =>
    navigate({
      pathname: '/sales/bulkOrderDetails',
      search: createSearchParams({
        id: id.toString()
      }).toString()
    });
  return (
    <div className='action-cell'>
      <Button variant='contained' onClick={() => navToViewBulkOrder(false)}>
        View Order
      </Button>
    </div>
  );
};

export const SalesOrderCellAction = ({ id }: GridRenderCellParams) => {
  const navigate = useNavigate();
  const navToViewBulkOrder = (edit: boolean) =>
    navigate({
      pathname: '/sales/salesOrderDetails',
      search: createSearchParams({
        id: id.toString()
      }).toString()
    });
  return (
    <div className='action-cell'>
      <Button variant='contained' onClick={() => navToViewBulkOrder(false)}>
        View Order
      </Button>
    </div>
  );
};

export const bulkOrderColumns: GridColDef[] = [
  { field: 'payeeName', headerName: 'Payee Name', flex: 1 },
  { field: 'payeeEmail', headerName: 'Email', flex: 1.5 },
  {
    field: 'paymentMode',
    headerName: 'Payment Mode',
    flex: 1,
    valueFormatter: (params) =>
      _.startCase(params.value.toString().toLowerCase())
  },
  {
    field: 'bulkOrderStatus',
    headerName: 'Order Status',
    flex: 1,
    valueFormatter: (params) =>
      _.startCase(params.value.toString().toLowerCase())
  },
  {
    field: 'salesOrders',
    headerName: 'No. Of Orders',
    flex: 0.5,
    valueGetter: (params) => params.row.salesOrders ?? 0,
    valueFormatter: (params) => params.value.length
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'center',
    flex: 1,
    renderCell: BulkOrderCellAction
  }
];

export const bulkOrderLineItems: GridColDef[] = [
  { field: 'customerName', headerName: 'Customer Name', flex: 1 },
  { field: 'customerContactNo', headerName: 'Contact No', flex: 1 },
  { field: 'customerAddress', headerName: 'Delivery Address', flex: 1 },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 1,
    valueGetter: (params) => params.row.amount ?? 0,
    valueFormatter: (params) => '$' + params.value.toFixed(2)
  },
  {
    field: 'orderStatus',
    headerName: 'Order Status',
    flex: 1,
    valueFormatter: (params) =>
      _.startCase(params.value.toString().toLowerCase())
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'center',
    flex: 1,
    renderCell: SalesOrderCellAction
  }
];
