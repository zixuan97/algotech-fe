import React from 'react';
import { useNavigate } from 'react-router';
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
  GridValueGetterParams
} from '@mui/x-data-grid';
import { GridRenderCellParams } from '@mui/x-data-grid';
import '../../styles/pages/procurement.scss';
import { Button, Chip, ChipProps } from '@mui/material';
import { ProcurementOrder, Supplier } from 'src/models/types';
import { getAllProcurementOrders } from 'src/services/procurementService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import ViewOrderButton from 'src/components/procurement/ViewOrderButton';
import OrderFulfilmentStatusCell from 'src/components/procurement/OrderFulfilmentStatusCell';

function getChipProps(params: GridRenderCellParams): ChipProps {
  return {
    label: params.value
  };
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', flex: 1 },
  {
    field: 'orderDate',
    headerName: 'Date',
    flex: 1,
    valueFormatter: (params: GridValueFormatterParams<Date>) => {
      let date = params.value;
      date = new Date(date);
      const valueFormatted = date.toDateString();
      return valueFormatted;
    }
  },
  {
    field: 'supplierName',
    headerName: 'Supplier Name',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.value.map((supplier: Supplier) => supplier.name)
  },
  {
    field: 'paymentStatus',
    headerName: 'Payment Status',
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
    flex: 1,
    renderCell: OrderFulfilmentStatusCell
  },
  { field: 'totalAmount', headerName: 'Order Total', type: 'number', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    type: 'number',
    flex: 1,
    renderCell: ViewOrderButton
  }
];

const AllProcurementOrders = () => {
  const navigate = useNavigate();

  const [procurementOrders, setProcurementOrders] = React.useState<
    ProcurementOrder[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllProcurementOrders(),
      (res) => {
        setLoading(false);
        setProcurementOrders(res);
      },
      () => setLoading(false)
    );
  }, []);

  return (
    <div className='procurement-orders'>
      <h1>Procurement Orders</h1>
      <div className='procurement-grid-toolbar'>
        <Button
          variant='contained'
          size='medium'
          sx={{ height: 'fit-content' }}
          onClick={() => navigate({ pathname: 'createProcurementOrder' })}
        >
          Add New Order
        </Button>
      </div>
      <DataGrid
        isRowSelectable={(params: GridRowParams) =>
          params.row.fulfilmentStatus === 'Arrived'
        }
        columns={columns}
        loading={loading}
        rows={procurementOrders}
        autoHeight
      />
    </div>
  );
};

export default AllProcurementOrders;
