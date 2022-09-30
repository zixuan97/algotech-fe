import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams
} from '@mui/x-data-grid';
import ManualDeliveryCellAction from 'src/components/delivery/ManualDeliveryCellAction';
import '../../styles/common/common.scss';
import '../../styles/pages/delivery/map.scss';
import '../../styles/pages/delivery/delivery.scss';
import 'leaflet/dist/leaflet.css';
import { Stack, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { DeliveryOrder } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  getAllDeliveriesPostalCodeByDate,
  getManualDeliveryOrdersByRangeSvc,
  getAllDeliveries
} from 'src/services/deliveryServices';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { arrayBuffer } from 'stream/consumers';
import axios from 'axios';
import markerIconPng from 'src/components/delivery/red_marker.png';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import moment from 'moment';
import DeliveryOrderStatusCell from 'src/components/delivery/DeliveryOrderStatusCell';

const myIcon = new Icon({
  iconUrl: markerIconPng,
  iconSize: [23, 38],
});

// TODO: Check if delivery date is undefined
const columns: GridColDef[] = [
  {
    field: 'salesOrderId',
    headerName: 'Sales Order ID',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.salesOrder.id
  },
  {
    field: 'orderStatus',
    headerName: 'Delivery Status',
    flex: 1,
    renderCell: DeliveryOrderStatusCell
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
    valueFormatter: (params: GridValueFormatterParams<Date>) => {
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

const AllManualDeliveries = () => {
  const navigate = useNavigate();

  const [deliveryData, setDeliveryData] = React.useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [deliveryPostalCode, setDeliveryPostalCode] = React.useState<any[]>([]);
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('day'),
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
        <h1>All Manual Deliveries</h1>
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
      <MapContainer
        center={[1.3667, 103.8]}
        zoom={12}
        minZoom={11}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
          url='https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png'
        />
        {deliveryPostalCode.map((data) => {
          return (
            <Marker position={[data.LATITUDE, data.LONGTITUDE]} icon={myIcon}>
              <Popup>{data.ADDRESS}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
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

export default AllManualDeliveries;
