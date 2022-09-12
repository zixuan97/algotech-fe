import React from 'react';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { GridRenderCellParams } from '@mui/x-data-grid';
import '../../styles/pages/procurement.scss';
import { Chip, ChipProps } from '@mui/material';

function getChipProps(params: GridRenderCellParams): ChipProps {
  return {
    label: params.value
  };
}

const columns: GridColDef[] = [
  { field: 'orderId', headerName: 'Order ID', flex: 1 },
  { field: 'date', headerName: 'Date', flex: 1 },
  { field: 'supplierId', headerName: 'Supplier ID', flex: 1 },
  {
    field: 'paymentStatus',
    headerName: 'Payment Status',
    type: 'number',
    flex: 1,
    renderCell: (params) => {
      return (
        <Chip {...getChipProps(params)} style={{ fontFamily: 'Poppins' }} />
      );
    }
  },
  {
    field: 'fulfilmentStatus',
    headerName: 'Fulfilment Status',
    type: 'number',
    flex: 1,
    renderCell: (params) => {
      return (
        <Chip {...getChipProps(params)} style={{ fontFamily: 'Poppins' }} />
      );
    }
  },
  { field: 'orderTotal', headerName: 'Order Total', type: 'number', flex: 1 }
];

const data = [
  {
    id: 1,
    orderId: 1234,
    date: '03/03/12 22:43',
    supplierId: 456,
    paymentStatus: 'Paid',
    fulfilmentStatus: 'Complete',
    orderTotal: 4500
  },
  {
    id: 2,
    orderId: 1234,
    date: '03/03/12 22:43',
    supplierId: 456,
    paymentStatus: 'Not Paid',
    fulfilmentStatus: 'Arrived',
    orderTotal: 4500
  }
];

const Procurement = () => {
  return (
    <div className='procurement-orders'>
      <h1>Procurement Orders</h1>
      <DataGrid
        checkboxSelection
        isRowSelectable={(params: GridRowParams) =>
          params.row.fulfilmentStatus === 'Arrived'
        }
        columns={columns}
        rows={data}
        autoHeight
      />
    </div>
  );
};

export default Procurement;
