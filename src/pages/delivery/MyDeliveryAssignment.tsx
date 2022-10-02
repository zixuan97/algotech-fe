import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridRenderCellParams
} from '@mui/x-data-grid';
import ManualDeliveryCellAction from 'src/components/delivery/ManualDeliveryCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import {
  TextField,
  Stack,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search } from '@mui/icons-material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { DeliveryOrder, OrderStatus } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  editDeliveryOrder,
  getAllAssignedDeliveriesPostalCodeByDate,
  getAllAssignedDeliveriesByDate,
  getAllUnassignedDeliveries,
  getAllUnassignedDeliveriesPostalCodeByDate,
  getCurrentLocationLatLng
} from 'src/services/deliveryServices';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import assignedMarker from 'src/components/delivery/assigned.png';
import unassignedMarker from 'src/components/delivery/unassigned.png';
import currentMarker from 'src/components/delivery/current.png';
import AuthContext from 'src/context/auth/authContext';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import moment from 'moment';
import DeliveryOrderStatusCell from 'src/components/delivery/DeliveryOrderStatusCell';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';

const columns: GridColDef[] = [
  {
    field: 'salesOrderId',
    headerName: 'Order ID',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salesOrder.orderId
  },
  {
    field: 'orderStatus',
    headerName: 'Delivery Status',
    flex: 1,
    renderCell: DeliveryOrderStatusCell,
    valueGetter: (params) => {
      let orderStatus = params.row.salesOrder.orderStatus;
      let cell;

      if (orderStatus === OrderStatus.READY_FOR_DELIVERY) {
        cell = 'Delivery Scheduled';
      } else if (orderStatus === OrderStatus.SHIPPED) {
        cell = 'Shipped';
      } else if (orderStatus === OrderStatus.COMPLETED) {
        cell = 'Completed';
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
    renderCell: ManualDeliveryCellAction
  }
];

const MyDeliveryAssignment = () => {
  const columnsBottom: GridColDef[] = [
    {
      field: 'salesOrderId',
      headerName: 'Order ID',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.salesOrder.orderId
    },
    {
      field: 'orderStatus',
      headerName: 'Delivery Status',
      flex: 1,
      renderCell: DeliveryOrderStatusCell,
      valueGetter: (params) => {
        let orderStatus = params.row.salesOrder.orderStatus;
        let cell;

        if (orderStatus === OrderStatus.READY_FOR_DELIVERY) {
          cell = 'Delivery Scheduled';
        } else if (orderStatus === OrderStatus.SHIPPED) {
          cell = 'Shipped';
        } else if (orderStatus === OrderStatus.COMPLETED) {
          cell = 'Completed';
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
      renderCell: (params: GridRenderCellParams<DeliveryOrder>) => (
        <strong>
          {/* {params.row.salesOrder.orderId} */}
          <Button
            variant='contained'
            size='medium'
            style={{ marginLeft: 16 }}
            tabIndex={params.hasFocus ? 0 : -1}
            onClick={() => handleConfirmAssignment(params.row)}
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
  const [tempDO, setTempDO] = React.useState<DeliveryOrder>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [latlng, setLatLng] = React.useState<any>();
  const [currentLocation, setCurrentLocation] = React.useState<string>();
  const authContext = React.useContext(AuthContext);
  const { user } = authContext;
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('month'),
    moment().endOf('day')
  ]);

  const assignedIcon = new Icon({
    iconUrl: assignedMarker,
    iconSize: [23, 35]
  });

  const unassignedIcon = new Icon({
    iconUrl: unassignedMarker,
    iconSize: [23, 35]
  });

  const currentIcon = new Icon({
    iconUrl: currentMarker,
    iconSize: [23, 35]
  });

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getAllAssignedDeliveriesByDate(dateRange, user?.id),
      (res) => {
        setLoading(false);
        setAssignedDeliveries(res);
        console.log(user?.id);
        console.log('Delivery orders are' + { res });
        console.log(JSON.stringify(res));
      },
      () => setLoading(false)
    );
  }, [user, dateRange]);

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(getAllUnassignedDeliveries(dateRange), (res) => {
      const sortedDeliveryDate = res.sort((a, b) =>
        moment(a.deliveryDate).diff(b.deliveryDate)
      );
      setUnassignedDeliveries(sortedDeliveryDate);
      // console.log('Delivery orders are' + { sortedDeliveryDate });
      // console.log(JSON.stringify(res));
    });
    setLoading(false);
  }, [dateRange]);

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
    console.log('enter method');
    deliveryOrder.assignedUserId = user?.id;
    asyncFetchCallback(
      editDeliveryOrder(deliveryOrder),
      () => {
        setModalOpen(false);
        setUnassignedDeliveries(
          unassignedDeliveries.filter((x) => x.id !== deliveryOrder.id)
        );
        setAssignedDeliveries([...assignedDeliveries, deliveryOrder]);
        setAlert({
          severity: 'success',
          message: 'Delivery Order assigned successfully.'
        });
      },
      (err) => {
        setAlert({
          severity: 'error',
          message: 'Delivery Order not assigned successfully, please try again!'
        });
      }
    );
  };

  const findCurrentLocation = (event: React.MouseEvent<HTMLElement>) => {
    setLoading(true);
    asyncFetchCallback(
      getCurrentLocationLatLng({ address: currentLocation }),
      (res) => {
        setLoading(false);
        setLatLng(res);
        console.log(res.length);
        if (res.length === 0) {
          setAlert({
            severity: 'error',
            message: 'Location not found, please enter a valid location!'
          });
        } else {
          setAlert({
            severity: 'success',
            message: 'Current location marker plotted successfully.'
          });
        }
      }
    );
  };

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

  const handleConfirmAssignment = (deliveryOrder: DeliveryOrder) => {
    console.log(deliveryOrder);
    setModalOpen(true);
    setTempDO(deliveryOrder);
  };

  return (
    <div className='delivery-orders'>
      <ConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => editDelivery(tempDO!)}
        title='Assign Delivery'
        body='Are you sure you want to take on this delivery? For any changes in delivery assignment, please contact admin!'
      />
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>My Assigned Deliveries</h1>
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
        {/* <Polyline pathOptions={limeOptions} positions={latlngs} /> */}

        <TileLayer
          attribution='&copy; <img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {latlng && (
          <Marker
            position={[latlng.LATITUDE, latlng.LONGTITUDE]}
            icon={currentIcon}
          >
            <Popup>Your current location is {latlng.ADDRESS} </Popup>
          </Marker>
        )}
        {unassignedDeliveryPostalCode.map((data) => {
          return (
            <Marker
              key={data.orders.orderId}
              position={[data.LATITUDE, data.LONGTITUDE]}
              icon={unassignedIcon}
            >
              <Popup>
                Delivery address: {data.ADDRESS}
                <br></br>
                Order Id: {data.orders.orderId}
                <br></br>
                Order Status: {data.orders.orderStatus}
              </Popup>
            </Marker>
          );
        })}
        {assignedDeliveryPostalCode.map((data) => {
          return (
            <Marker
              key={data.orders.orderId}
              position={[data.LATITUDE, data.LONGTITUDE]}
              icon={assignedIcon}
            >
              <Popup>
                Delivery address: {data.ADDRESS}
                <br></br>
                Order Id: {data.orders.orderId}
                <br></br>
                Order Status: {data.orders.orderStatus}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <br></br>
      <Typography variant='h3' align='left'>
        Green: Unassigned Deliveries &nbsp; Red: Assigned Deliveries &nbsp;
        Blue: Current Location
      </Typography>
      <br></br>
      <DataGrid
        columns={columns}
        rows={filteredData}
        autoHeight
        loading={loading}
      />
      <br></br>
      <h1>Assign Delivery</h1>
      {alert && (
        <TimeoutAlert
          alert={alert}
          timeout={5000}
          clearAlert={() => setAlert(null)}
        />
      )}
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
