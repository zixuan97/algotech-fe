import { GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Button, Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
// import '../../../styles/common/actionCells.scss';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import _ from 'lodash';
import PaymentModeCell from './PaymentModeCell';
import moment from 'moment';
import { BulkOrderStatus, PaymentMode } from 'src/models/types';
import BulkOrderStatusCell from './BulkOrderStatusCell';

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

export const bulkOrderColumns: GridColDef[] = [
  { field: 'createdTime',
    headerName: 'Order Date',
    flex: 1,
    valueGetter: (params) => params.row.createdTime,
    valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY')
  },
  { field: 'paymentMode', 
    headerName: 'Payment Mode', 
    flex: 1,
    renderCell: PaymentModeCell,
    // valueFormatter: (params) => _.startCase(params.value.toString().toLowerCase())
    // valueGetter: (params) => params.row.paymentMode,
    // valueFormatter: (params) => {<PaymentChip bulkOrder={params.value}/>}
    valueGetter: (params) => {
      let paymentMode = params.row.paymentMode;
      let cell;

      if (paymentMode === PaymentMode.CREDIT_CARD) {
        cell = 'Credit Card';
      } else if (paymentMode === PaymentMode.BANK_TRANSFER) {
        cell = 'Bank Transfer';
      } else {
        cell = 'Paynow';
      }
      return cell;
    }
  },
  { field: 'bulkOrderStatus',
    headerName: 'Order Status',
    flex: 1,
    renderCell: BulkOrderStatusCell ,
    valueGetter: (params) => {
      let bulkOrderStatus = params.row.bulkOrderStatus;
      let cell;

      if (bulkOrderStatus === BulkOrderStatus.CANCELLED) {
        cell = 'Cancelled';
      } else if (bulkOrderStatus === BulkOrderStatus.CREATED) {
        cell = 'Created';
      } else if (bulkOrderStatus === BulkOrderStatus.FULFILLED) {
        cell = 'Fulfilled';
      } else if (bulkOrderStatus === BulkOrderStatus.PAYMENT_FAILED) {
        cell = 'Payment Failed';
      } else {
        cell = 'Payment Success';
      }
      return cell;
    }
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

