import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import DeliveryCellAction from 'src/components/delivery/DeliveryCellAction';
import '../../styles/common/common.scss';
import '../../styles/pages/delivery/map.scss';
import '../../styles/pages/delivery/delivery.scss';
import 'leaflet/dist/leaflet.css';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { DeliveryOrder, ShippingType } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  getAllDeliveries,
  getAllDeliveriesPostalCode,
  getAllDeliveriesPostalCodeByDate
} from 'src/services/deliveryServices';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { arrayBuffer } from 'stream/consumers';
import axios from 'axios';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import moment from 'moment';

const myIcon = new Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41]
});

// TODO: Check if delivery date is undefined
const columns: GridColDef[] = [
  { field: 'salesOrderId', headerName: 'Order ID', flex: 1 },
  { field: 'status', headerName: 'Delivery Status', flex: 1 },
  {
    field: 'shippingAddress',
    headerName: 'Address',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salesOrder.customerAddress
  },
  { field: 'deliveryDate', headerName: 'Delivery Date', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: DeliveryCellAction
  }
];

const AllManualDeliveries = () => {
  const navigate = useNavigate();

  const [searchField, setSearchField] = React.useState<string>('');
  const [deliveryData, setDeliveryData] = React.useState<DeliveryOrder[]>([]);
  const [filteredData, setFilteredData] = React.useState<DeliveryOrder[]>([]);
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
    asyncFetchCallback(
      getAllDeliveries(),
      (res) => {
        setLoading(false);
        setDeliveryData(res);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? deliveryData.filter((delivery) =>
            Object.values(delivery).some((value) =>
              String(value).toLowerCase().match(searchField.toLowerCase())
            )
          )
        : deliveryData
    );
  }, [searchField, deliveryData]);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // here
    setSearchField(e.target.value);
  };

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
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <Search />
          <TextField
            id='search'
            label='Search'
            margin='normal'
            fullWidth
            onChange={handleSearchFieldChange}
          />
        </div>
        <Button
          variant='contained'
          size='large'
          sx={{ height: 'fit-content' }}
          onClick={() => navigate({ pathname: 'createDelivery' })}
        >
          Create Manual Delivery
        </Button>
      </div>
      <DataGrid
        columns={columns}
        rows={filteredData}
        autoHeight
        loading={loading}
      />
    </div>
  );
};

export default AllManualDeliveries;
