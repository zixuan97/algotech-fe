import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ManualDeliveryCellAction from 'src/components/delivery/ManualDeliveryCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { TextField, Stack, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { DeliveryOrder } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  getAllAssignedManualDeliveries,
  getAllUnassignedDeliveries,
  getCurrentLocationLatLng,
  getAllUnassignedDeliveriesPostalCodeByDate
} from 'src/services/deliveryServices';
import { useNavigate } from 'react-router';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  Polyline
} from 'react-leaflet';
import { Icon } from 'leaflet';
import markerIconPng from 'src/components/delivery/red_marker.png';
import AuthContext from 'src/context/auth/authContext';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import moment from 'moment';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Delivery ID', flex: 1 },
  { field: 'deliveryStatus', headerName: 'Delivery Status', flex: 1 },
  { field: 'shippingAddress', headerName: 'Address', flex: 1 },
  { field: 'shippingDate', headerName: 'Order Date', flex: 1 },
  { field: 'eta', headerName: 'Delivery Date', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: ManualDeliveryCellAction
  }
];

const columnsBottom: GridColDef[] = [
  { field: 'id', headerName: 'Delivery ID', flex: 1 },
  { field: 'deliveryStatus', headerName: 'Delivery Status', flex: 1 },
  { field: 'shippingAddress', headerName: 'Address', flex: 1 },
  { field: 'shippingDate', headerName: 'Order Date', flex: 1 },
  { field: 'eta', headerName: 'Delivery Date', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: ManualDeliveryCellAction
  }
];

const DeliveryAssignment = () => {
  const [searchField, setSearchField] = React.useState<string>('');
  const [assignedDeliveries, setAssignedDeliveries] = React.useState<
    DeliveryOrder[]
  >([]);
  const [unassignedDeliveries, setUnassignedDeliveries] = React.useState<
    DeliveryOrder[]
  >([]);
  const [filteredData, setFilteredData] = React.useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [latlng, setLatLng] = React.useState<any>();
  const [currentLocation, setCurrentLocation] = React.useState<string>();
  const [unassignedDeliveryPostalCode, setUnassignedDeliveryPostalCode] =
    React.useState<any[]>([]);
  const authContext = React.useContext(AuthContext);
  const { user } = authContext;
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('day'),
    moment().endOf('day')
  ]);

  const myIcon = new Icon({
    iconUrl: markerIconPng,
    iconSize: [23, 38]
  });

  // //get polyline
  // const limeOptions = { color: 'lime' };
  // const route_geometry =
  //   '_vjGmkwxR@RFv@w@JBwBGsAMoARAh@CtAWt@WtBgALINRd@r@hAbAf@XbAb@bCp@fDv@\\HDSpAkF@GtCuKf@oBRq@fAaEDYZoBF_@T_F@Y@QLBlCl@h@J`IdBjAV`B^LDNBnBd@ZH`CT~AHjEBfAO`FGx@EvDh@j@PpH~BtH|BlAVLBLBLBj@FlG^dCXhBD^@k@pBG^Av@BVNb@`@x@rC}A`A]tA[fBKfBLnFP|DNj@Fj@N^Pj@b@|@rAhBzDdChFvBjEd@xATfALvABtBExASdCIvBCnABf@HlBV|Bp@jDl@~Bp@vBp@lBpAfC`BrCnDdGlEpHbAdBxAfCXd@~A~Cn@zAx@tBv@rB|@bBt@hAt@v@hCjBdCzAv@NZBX?PELGJKHMDM?K?QESGOIIOISES?YDSFWPOVcDjHaAbCo@~Bi@|A[jBi@hBs@fBy@rAkQlSuA~AoD`EaErEqAxAsOnNoDhDgEtDeF|EuHbHcBpB_BlCiAhCeA`Dc@rCStCAdCJ`CTtBd@pCd@lBj@`Br@lAz@`A`Aj@~@f@`EtAv@V|@ZdAb@`Aj@t@p@r@`Av@vApDdLrDxLfAzEp@tCv@pDrA~BdA`AtAt@tBv@rMvEdBbAbAv@r@t@jAzAhAzAjDlF`B~CvAjDjBpFbD`Kn@jCPxAVvC@xBAxB[|Ci@vCkAlDgB~DeEhJUb@_LzUcBnD_Rn`@wN~ZqC~F_AtBcBvDk@dBc@nB[fBSjBM~ACbBC|BJfBAdBc@tBs@tCOv@Bf@Lb@z@jAdC~@vA^tA^j@Ld@NzA`@~Ah@xAx@bBfA\\RU^y@hAkBpC}G`Ks@tAk@xAe@bBEXEPEXG\\OvAIbB?`HEpAOrAeAhG[`CGr@KrDDxCBv@JhADf@Db@NrArCpL|CbLx@nCV|@TnAf@dBtFnSH\\FRFTLb@~AbGX`AJ\\J\\XbAl@`Cl@pAV\\NTaB`ASH';
  // var polyUtil = require('polyline-encoded');
  // var encoded = route_geometry;
  // if (encoded !== undefined || encoded !== '' || encoded != null) {
  //   var latlngs = polyUtil.decode(encoded, {
  //     precision: 6
  //   });
  //   latlngs.forEach((x:number[])=> {
  //     var temp = x[1]
  //     x[1] = x[0]*10
  //     x[0] = temp *10
  //   })
  //   console.log(latlngs);
  // }

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

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getCurrentLocationLatLng(currentLocation),
      (res) => {
        setLoading(false);
        setLatLng(res);
        console.log(res);
      },
      () => setLoading(false)
    );
  }, [currentLocation]);

  React.useEffect(() => {
    asyncFetchCallback(
      getAllUnassignedDeliveriesPostalCodeByDate(dateRange),
      setUnassignedDeliveryPostalCode
    );
  }, [dateRange]);

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
            fullWidth
            onChange={handleSearchFieldChange}
          />
        </div>
      </div>
      <DataGrid
        columns={columns}
        rows={filteredData}
        autoHeight
        loading={loading}
      />
      <br></br>
      <br></br>
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>Assign Deliveries</h1>
        <Stack direction='row' spacing={2}>
          <Typography className='date-picker-text'>
            View unassigned deliveries from
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
        {/* <Marker position={[latlng.LATITUDE, latlng.LONGTITUDE]} icon={myIcon}>
            <Popup>Your current location is {latlng.ADDRESS}</Popup>
        </Marker> */}
        {unassignedDeliveryPostalCode.map((data) => {
          return (
            <Marker position={[data.LATITUDE, data.LONGTITUDE]} icon={myIcon}>
              <Popup>{data.ADDRESS}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <br></br>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <MyLocationIcon />
          <TextField
            id='search'
            label='Enter your starting location'
            margin='normal'
            fullWidth
            onChange={handleLocationChange}
          />
        </div>
      </div>
      <DataGrid
        columns={columnsBottom}
        rows={unassignedDeliveries}
        autoHeight
        loading={loading}
      />
    </div>
  );
};

export default DeliveryAssignment;
