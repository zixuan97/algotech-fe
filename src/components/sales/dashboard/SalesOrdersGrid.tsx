import { DataGrid, GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import React from 'react';
import salesContext from 'src/context/sales/salesContext';
import { READABLE_DDMMYY_TIME } from 'src/utils/dateUtils';

const columns: GridColDef[] = [
  {
    field: 'orderId',
    headerName: 'Order Number',
    flex: 1
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1
  },
  {
    field: 'platformType',
    headerName: 'Platform',
    flex: 1
  },
  {
    field: 'amount',
    headerName: 'Order Amount',
    valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    flex: 0.6
  },
  {
    field: 'customerAddress',
    headerName: 'Customer Address',
    flex: 1.5
  },
  {
    field: 'postalCode',
    headerName: 'Postal Code',
    flex: 0.6
  },
  {
    field: 'createdTime',
    headerName: 'Order Date',
    valueGetter: (params) => moment(params.value),
    valueFormatter: (params) => params.value.format(READABLE_DDMMYY_TIME),
    flex: 1.2
  },
  {
    field: 'deliveryOrder',
    headerName: 'Delivery Status',
    valueGetter: (params) => params.value?.deliveryStatus ?? '',
    flex: 1.4
  }
];

const SalesOrdersGrid = () => {
  const { salesOrders } = React.useContext(salesContext);

  return (
    <DataGrid
      sx={{ fontSize: '0.8em' }}
      columns={columns}
      rows={salesOrders}
      autoHeight
      pageSize={5}
    />
  );
};

export default SalesOrdersGrid;
