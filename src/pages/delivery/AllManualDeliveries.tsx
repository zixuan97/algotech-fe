import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import DeliveryCellAction from 'src/components/delivery/DeliveryCellAction';
import '../../styles/pages/delivery/delivery.scss';
import '../../styles/common/common.scss';
import '../../styles/pages/delivery/map.scss';
import 'leaflet/dist/leaflet.css';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { DeliveryOrder } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllDeliveries } from 'src/services/deliveryServices';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

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

  // const [latLng, setLatLng] = React.useState([]);
  // async function getAddress(postalCode) {
  //   var genURL = “https://developers.onemap.sg/commonapi/search?searchVal=" + postalCode + “&returnGeom=Y&getAddrDetails=N&pageNum=1”;
  //   var response = await fetch(genURL);
  //   var data = await response.json();
  //   var latlng = data.results[0].ADDRESS;
  //   setAddress(address);
  //   console.log(myAddress);
  //   return address;
  // }

  return (
    <div className='delivery-orders'>
      <div className='delivery-orders-section-header'>
        <h1>All Manual Deliveries for</h1>
        <div className='delivery-orders-date-picker-section'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Start Date'
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
            <h2>to</h2>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='End Date'
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
      </div>
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
        <Marker position={[1.3667, 103.8]} icon={myIcon}>
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
          onClick={() => navigate({ pathname: '' })}
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
