import { GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Button, Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
// import '../../../styles/common/actionCells.scss';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import _ from 'lodash';
import PaymentChip from './PaymentChip';
import moment from 'moment';

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
        View Bulk Order
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
  { field: 'createdTime',
    headerName: 'Order Date',
    flex: 1,
    valueGetter: (params) => params.row.createdTime,
    valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY')
  },
  { field: 'paymentMode', 
    headerName: 'Payment Mode', 
    flex: 1
    // valueGetter: (params) => params.row.paymentMode,
    // // valueFormatter: (params) => {<Chip label={_.startCase(params.value.toLowerCase())} />}
    // valueFormatter: (params) => {<PaymentChip bulkOrder={params.value}/>}
  },
  { field: 'bulkOrderStatus', headerName: 'Order Status', flex: 1 },
  {
    field: 'salesOrders',
    headerName: 'No. Of Orders',
    flex: 1,
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

