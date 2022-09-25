import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import DeliveryCellAction from 'src/components/delivery/DeliveryCellAction';
import '../../styles/pages/delivery/delivery.scss';
import '../../styles/common/common.scss';
import '../../styles/pages/delivery/map.scss';
import '../../styles/pages/delivery/delivery.scss';
import 'leaflet/dist/leaflet.css';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { DeliveryOrder, ShippingType } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllDeliveries, getAllDeliveriesPostalCode, testing } from 'src/services/deliveryServices';
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
  const [deliveryPostalCode, setDeliveryPostalCode] = React.useState<DeliveryOrder[]>([]);
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('day'),
    moment().endOf('day')
  ]);

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


  // async function getLatLng(postalCode) {
  //   var genURL = 'https://developers.onemap.sg/commonapi/search?searchVal=" + postalCode + “&returnGeom=Y&getAddrDetails=N&pageNum=1';
  //   var response = await fetch(genURL);
  //   var data = await response.json();
  //   var latitude = data.results[0].LATITUDE;
  //   var longtitude = data.results[0].LONGTITUDE;
  //   latLng = [latitude,longtitude];
  //   setLatLng(latLng);
  //   console.log(myAddress);
  //   return address;
  // }

  //call backend to retrieve postal code []postal code
  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getAllDeliveriesPostalCode(),
      (res) => {
        setLoading(false);
        setDeliveryPostalCode(res);
      },
      () => setLoading(false)
    );
  }, []);

//   deliveryPostalCode.push({
//     id: 2,
//     deliveryStatus: DeliveryStatus.DELIVERYINPROGRESS,
//     shippingDate: new Date(),
//     shippingType: ShippingType.MANUAL,
//     currentLocation: 'Blk 400 NUS Road #01-01',
//     eta: new Date(),
//     salesOrderId: 1
//   }
// );

  // //convert postal code to lat and long so that markers can be generated
  // deliveryPostalCode.map((deliveryOrder) => {
  //   // apply ur logic to convert
  //   var genURL = `https://developers.onemap.sg/commonapi/search?searchVal=${560256}&returnGeom=Y&getAddrDetails=N&pageNum=1`;
  //   asyncFetchCallback (
  //     testing(560256), 
  //     (res) => {
  //       console.log(res);
  //     }
  //   )
    // var response = await fetch(genURL);
    // var data = await response.json();
    // var latitude = data.results[0].LATITUDE;
    // var longtitude = data.results[0].LONGTITUDE;
    // var latLng = [latitude,longtitude];
    // console.log(latLng);
    // return latLng;
  // })

  React.useEffect(() => {
    // TODO: implement error callback
    axios.get(`https://developers.onemap.sg/commonapi/search?searchVal=${560256}&returnGeom=Y&getAddrDetails=N&pageNum=1`)
    .then((res) => console.log(res.data));
  }, []);



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
        {/* {deliveryPostalCode.map((postalCode)=> {
          return (
            <Marker position={} icon = {myIcon}>
            <Popup>
              {postalCode}
            </Popup>
          </Marker>
          )
        })} */}
        <Marker position={[1.3667, 103.8]} icon = {myIcon}>
          <Popup>
            Delivery 1 <br /> Singapore
          </Popup>
        </Marker>
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
