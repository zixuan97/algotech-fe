import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridValueFormatterParams,
  GridRenderCellParams
} from '@mui/x-data-grid';
import DeliveryCellAction from 'src/components/delivery/DeliveryCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { TextField, Stack, Typography, Button, CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { DeliveryOrder } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  editDeliveryOrder,
  getAllAssignedDeliveriesPostalCodeByDate,
  getAllAssignedManualDeliveries,
  getAllUnassignedDeliveries,
  getAllUnassignedDeliveriesPostalCodeByDate,
  getCurrentLocationLatLng
} from 'src/services/deliveryServices';
import { useNavigate } from 'react-router';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import { Icon } from 'leaflet';
import redMarker from 'src/components/delivery/red_marker.png';
import greenMarker from 'src/components/delivery/green_marker.png';
import blueMarker from 'src/components/delivery/blue_marker.png';
import AuthContext from 'src/context/auth/authContext';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import moment from 'moment';
import DeliveryOrderStatusCell from 'src/components/delivery/DeliveryOrderStatusCell';

const columns: GridColDef[] = [
  {
    field: 'salesOrderId',
    headerName: 'Order ID',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.salesOrder.orderId
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
    renderCell: DeliveryCellAction
  }
];

// const columnsBottom: GridColDef[] = [
//   {
//     field: 'salesOrderId',
//     headerName: 'Order ID',
//     flex: 1,
//     valueGetter: (params: GridValueGetterParams) => params.row.salesOrder.orderId
//   },
//   {
//     field: 'orderStatus',
//     headerName: 'Delivery Status',
//     flex: 1,
//     renderCell: DeliveryOrderStatusCell
//   },
//   {
//     field: 'salesOrder',
//     headerName: 'Address',
//     flex: 1,
//     valueGetter: (params: GridValueGetterParams) =>
//       params.row.salesOrder.customerAddress
//   },
//   {
//     field: 'deliveryDate',
//     headerName: 'Delivery Date',
//     flex: 1,
//     valueFormatter: (params: GridValueFormatterParams<Date>) => {
//       let date = params.value;
//       let valueFormatted = moment(date).format('DD/MM/YYYY');
//       return valueFormatted;
//     }
//   },
//   {
//     field: 'action',
//     headerName: 'Action',
//     headerAlign: 'right',
//     align: 'right',
//     flex: 1,
//     renderCell: (params: GridRenderCellParams) => (
//       <strong>
//         {params.row.salesOrder.orderId}
//         <Button
//           variant="contained"
//           size="small"
//           style={{ marginLeft: 16 }}
//           tabIndex={params.hasFocus ? 0 : -1}
//           onClick={()=>editDelivery(params.row)}
//         >
//           Open
//         </Button>
//       </strong>
//     )
//   }
// ];

const MyDeliveryAssignment = () => {

  const columnsBottom: GridColDef[] = [
    {
      field: 'salesOrderId',
      headerName: 'Order ID',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params.row.salesOrder.orderId
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
      renderCell: (params: GridRenderCellParams<DeliveryOrder>) => (
        <strong>
          {/* {params.row.salesOrder.orderId} */}
          <Button
            variant="contained"
            size="medium"
            style={{ marginLeft: 16 }}
            tabIndex={params.hasFocus ? 0 : -1}
            onClick={() => editDelivery(params.row)}
          >
            Assign to me
          </Button>
        </strong>
      )
    }
  ];
  const [searchField, setSearchField] = React.useState<string>('');
  const [assignedDeliveries, setAssignedDeliveries] = React.useState<
    DeliveryOrder[]
  >([]);
  const [unassignedDeliveries, setUnassignedDeliveries] = React.useState<
    DeliveryOrder[]
  >([]);
  const [unassignedDeliveryPostalCode, setUnassignedDeliveryPostalCode] =
    React.useState<any[]>([]);
  const [assignedDeliveryPostalCode, setAssignedDeliveryPostalCode] =
    React.useState<any[]>([]);
  const [filteredData, setFilteredData] = React.useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [latlng, setLatLng] = React.useState<any>();
  const [currentLocation, setCurrentLocation] = React.useState<string>();
  const authContext = React.useContext(AuthContext);
  const { user } = authContext;
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('day'),
    moment().endOf('day')
  ]);

  const redIcon = new Icon({
    iconUrl: redMarker,
    iconSize: [23, 38]
  });

  const greenIcon = new Icon({
    iconUrl: greenMarker,
    iconSize: [23, 38]
  })

  const blueIcon = new Icon({
    iconUrl: blueMarker,
    iconSize: [23, 38]
  })

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getAllAssignedManualDeliveries(user?.id),
      (res) => {
        setLoading(false);
        setAssignedDeliveries(res);
        console.log(user?.id);
      },
      () => setLoading(false)
    );
  }, [user]);

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getAllUnassignedDeliveries(),
      (res) => {
        setLoading(false);
        setUnassignedDeliveries(res);
        console.log(res);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? assignedDeliveries.filter((category) =>
          Object.values(category).some((value) =>
            String(value).toLowerCase().match(searchField.toLowerCase())
          )
        )
        : assignedDeliveries
    );
  }, [searchField, assignedDeliveries]);

  const editDelivery = (deliveryOrder: DeliveryOrder) => {
    console.log('enter method')
    deliveryOrder.assignedUserId = user?.id
    asyncFetchCallback(
      editDeliveryOrder(deliveryOrder),
      () => {
        setUnassignedDeliveries(unassignedDeliveries.filter(
          (x) => x.id !== deliveryOrder.id
        ))
        setAssignedDeliveries([...assignedDeliveries, deliveryOrder])
      }
    )
  }

  const findCurrentLocation = (event: React.MouseEvent<HTMLElement>) => {
    setLoading(true);
    asyncFetchCallback(
      getCurrentLocationLatLng({ address: currentLocation }),
      (res) => {
        setLoading(false);
        setLatLng(res);
        console.log("Current location is [" + res.LATITUDE + "," + res.LONGTITUDE + "]");
      },
      () => setLoading(false)
    );
  }

  React.useEffect(() => {
    asyncFetchCallback(
      getAllUnassignedDeliveriesPostalCodeByDate(dateRange),
      setUnassignedDeliveryPostalCode
    );
  }, [dateRange]);

  React.useEffect(() => {
    asyncFetchCallback(
      getAllAssignedDeliveriesPostalCodeByDate(dateRange, user?.id),
      setAssignedDeliveryPostalCode
    );
  }, [dateRange, user?.id]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLocation(e.target.value);
    console.log(currentLocation);
  };

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };



  return (
    <div className='delivery-orders'>
      <h1>My Assigned Deliveries</h1>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <Search />
          <TextField
            id='search'
            label='Search'
            margin='normal'
            // fullWidth
            onChange={handleSearchFieldChange}
          />
        </div>
        <Stack direction='row' spacing={2}>
          <Typography className='date-picker-text'>
            View deliveries from
          </Typography>
          <DateRangePicker
            dateRange={dateRange}
            updateDateRange={setDateRange}
          />
        </Stack>
      </div>
      <MapContainer
        center={[1.3667, 103.8]}
        zoom={12}
        minZoom={11}
        scrollWheelZoom={true}
      >
        {/* <Polyline pathOptions={limeOptions} positions={latlngs} /> */}

        <TileLayer
          attribution='&copy; <img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {latlng &&
          <Marker position={[latlng.LATITUDE, latlng.LONGTITUDE]} icon={blueIcon}>
            <Popup>Your current location is {latlng.ADDRESS}</Popup>
          </Marker>}
        {unassignedDeliveryPostalCode.map((data) => {
          return (
            <Marker position={[data.LATITUDE, data.LONGTITUDE]} icon={greenIcon}>
              <Popup>{data.ADDRESS}</Popup>
            </Marker>
          );
        })}
        {assignedDeliveryPostalCode.map((data) => {
          return (
            <Marker position={[data.LATITUDE, data.LONGTITUDE]} icon={redIcon}>
              <Popup>{data.ADDRESS}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <body>Green: Unassigned deliveries</body>
      <body>Red: Assigned deliveries</body>
      <br></br>
      <DataGrid
        columns={columns}
        rows={filteredData}
        autoHeight
        loading={loading}
      />
      <br></br>
      <h1>Assign Delivery</h1>
      <div className='search-bar'>
        <MyLocationIcon />
        <TextField
          id='search'
          type='number'
          label='Enter your starting postal code'
          margin='normal'
          fullWidth
          onChange={handleLocationChange}
        />
        <Button
          variant='contained'
          size='small'
          sx={{ height: 'fit-content' }}
          color='primary'
          onClick={findCurrentLocation}
        >
          Find my current location
        </Button>
        {loading && <CircularProgress color='secondary' />}
      </div>
      <br></br>
      <DataGrid
        columns={columnsBottom}
        rows={unassignedDeliveries}
        autoHeight
        loading={loading}
      />
    </div>
  );
};

export default MyDeliveryAssignment;
