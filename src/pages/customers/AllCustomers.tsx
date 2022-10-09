import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ManualDeliveryCellAction from 'src/components/delivery/ManualDeliveryCellAction';
import '../../styles/common/common.scss';
import '../../styles/pages/delivery/map.scss';
import '../../styles/pages/delivery/delivery.scss';
import 'leaflet/dist/leaflet.css';
import { Stack, Typography } from '@mui/material';
import { DeliveryOrder, OrderStatus } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  getAllDeliveriesPostalCodeByDate,
  getManualDeliveryOrdersByRangeSvc
} from 'src/services/deliveryServices';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import manualMarker from 'src/resources/components/delivery/manual.png';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import moment from 'moment';
import DeliveryOrderStatusCell from 'src/components/delivery/DeliveryOrderStatusCell';

const manualIcon = new Icon({
  iconUrl: manualMarker,
  iconSize: [25, 38]
});
// TODO: Check if delivery date is undefined
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
    renderCell: DeliveryOrderStatusCell,
    valueGetter: (params) => {
      let orderStatus = params.row.salesOrder.orderStatus;
      let deliveryStatus = params.row.deliveryStatus?.status;
      let cell;

      if (deliveryStatus === 'cancelled') {
        cell = ' Cancelled';
      }

      if (orderStatus === OrderStatus.READY_FOR_DELIVERY) {
        cell = 'Delivery Scheduled';
      } else if (orderStatus === OrderStatus.SHIPPED) {
        cell = 'Shipped';
      } else {
        cell = 'Completed';
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
    renderCell: ManualDeliveryCellAction
  }
];

const AllCustomers = () => {
  const navigate = useNavigate();

  const [deliveryData, setDeliveryData] = React.useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [deliveryPostalCode, setDeliveryPostalCode] = React.useState<any[]>([]);
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('month'),
    moment().endOf('day')
  ]);

  React.useEffect(() => {
    asyncFetchCallback(
      getAllDeliveriesPostalCodeByDate(dateRange),
      setDeliveryPostalCode
    );
  }, [dateRange]);

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(getManualDeliveryOrdersByRangeSvc(dateRange), (res) => {
      const sortedDeliveryDate = res.sort((a, b) =>
        moment(a.deliveryDate).diff(b.deliveryDate)
      );
      setDeliveryData(sortedDeliveryDate);
      console.log(sortedDeliveryDate);
    });
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
        <h1>All Customers</h1>
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
      <div className='data-grid-container'>
        <DataGrid
          columns={columns}
          rows={deliveryData}
          autoHeight
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AllCustomers;
