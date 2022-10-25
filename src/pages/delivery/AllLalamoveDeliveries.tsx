import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import '../../styles/pages/delivery/delivery.scss';
import '../../styles/common/common.scss';
import { DeliveryOrder } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getLalamoveDeliveryOrdersByRangeSvc } from 'src/services/deliveryServices';
import moment from 'moment';
import { MomentRange } from 'src/utils/dateUtils';
import { Stack, Typography } from '@mui/material';
import DateRangePicker from 'src/components/common/DateRangePicker';
import LalamoveDeliveryOrderStatusCell from 'src/components/delivery/LalamoveDeliveryOrderStatusCell';
import LalamoveDeliveryCellAction from 'src/components/delivery/LalamoveDeliveryCellAction';

const columns: GridColDef[] = [
  {
    field: 'salesOrderId',
    headerName: 'Sales Order ID',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salesOrder.orderId
  },
  {
    field: 'id',
    headerName: 'Delivery Order ID',
    flex: 1
  },
  {
    field: 'status',
    headerName: 'Delivery Status',
    flex: 1,
    renderCell: LalamoveDeliveryOrderStatusCell,
    valueGetter: (params) => {
      let deliveryStatus = params.row.deliveryStatus.status;
      let cell;

      if (deliveryStatus === 'ASSIGNING_DRIVER') {
        cell = 'Assigning Driver';
      } else if (deliveryStatus === 'ON_GOING') {
        cell = 'Driver Assigned';
      } else if (deliveryStatus === 'PICKED_UP') {
        cell = 'Delivery in Progress';
      } else {
        cell = 'Cancelled';
      }

      return cell;
    }
  },
  {
    field: 'salesOrder',
    headerName: 'Address',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salesOrder.customerAddress
  },
  {
    field: 'deliveryDate',
    headerName: 'Delivery Date',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      let date = params.value;
      let valueFormatted = moment(date).format('DD/MM/YYYY');
      return valueFormatted;
    }
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: LalamoveDeliveryCellAction
  }
];

const AllShippitDeliveries = () => {
  const [deliveryData, setDeliveryData] = React.useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('month'),
    moment().endOf('day')
  ]);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getLalamoveDeliveryOrdersByRangeSvc(dateRange),
      (res) => {
        const sortedDeliveryDate = res.sort((a, b) =>
          moment(a.deliveryDate).diff(b.deliveryDate)
        );
        setDeliveryData(sortedDeliveryDate);
      }
    );
    setLoading(false);
  }, [dateRange]);

  return (
    <div className='delivery-orders'>
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>All Lalamove Deliveries</h1>
        <Stack direction='row' spacing={2}>
          <Typography className='date-picker-text'>
            View deliveries from
          </Typography>
          <DateRangePicker
            dateRange={dateRange}
            updateDateRange={setDateRange}
          />
        </Stack>
      </Stack>
      <DataGrid
        columns={columns}
        rows={deliveryData}
        autoHeight
        loading={loading}
        getRowId={(row) => row.shippitTrackingNum}
      />
    </div>
  );
};

export default AllShippitDeliveries;
