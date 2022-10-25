import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import '../../styles/pages/delivery/delivery.scss';
import '../../styles/common/common.scss';
import { DeliveryOrder } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getShippitDeliveryOrdersByRangeSvc } from 'src/services/deliveryServices';
import moment from 'moment';
import ShippitDeliveryCellAction from 'src/components/delivery/ShippitDeliveryCellAction';
import { MomentRange } from 'src/utils/dateUtils';
import { Stack, Typography } from '@mui/material';
import DateRangePicker from 'src/components/common/DateRangePicker';
import ShippitDeliveryOrderStatusCell from 'src/components/delivery/ShippitDeliveryOrderStatusCell';

const columns: GridColDef[] = [
  {
    field: 'salesOrderId',
    headerName: 'Sales Order ID',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salesOrder.orderId
  },
  { field: 'shippitTrackingNum', headerName: 'Tracking Number', flex: 1 },
  {
    field: 'status',
    headerName: 'Delivery Status',
    flex: 1,
    renderCell: ShippitDeliveryOrderStatusCell,
    valueGetter: (params) => {
      let deliveryStatus = params.row.deliveryStatus.status;
      let cell;

      if (deliveryStatus === 'order_placed') {
        cell = 'Order Placed';
      } else if (deliveryStatus === 'despatch_in_progress') {
        cell = 'Packing Order';
      } else if (deliveryStatus === 'ready_for_pickup') {
        cell = 'Booked for Delivery';
      } else if (deliveryStatus === 'untrackable') {
        cell = 'Out for Delivery';
      } else {
        cell = 'Cancelled';
      }

      return cell;
    }
  },
  { field: 'deliveryMode', headerName: 'Delivery Mode', flex: 1 },
  {
    field: 'deliveryDate',
    headerName: 'Estimated Delivery Date',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      if (params.value !== null) {
        let date = params.value;
        let valueFormatted = moment(date).format('DD/MM/YYYY');
        return valueFormatted;
      } else {
        return 'Delivery in Progress';
      }
    }
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: ShippitDeliveryCellAction
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
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getShippitDeliveryOrdersByRangeSvc(dateRange),
      (res) => {
        const sortedDeliveryDate = res.sort((a, b) =>
          moment(a.deliveryDate).diff(b.deliveryDate)
        );
        setDeliveryData(sortedDeliveryDate);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, [dateRange]);

  return (
    <div className='delivery-orders'>
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>All Shippit Deliveries</h1>
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
