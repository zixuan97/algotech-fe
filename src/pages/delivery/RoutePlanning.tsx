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
    CircularProgress
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { DeliveryOrder, OrderStatus } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
    getPlannedRoute,
    getCurrentLocationLatLng
} from 'src/services/deliveryServices';
import AuthContext from 'src/context/auth/authContext';
import moment, { Moment } from 'moment';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import RoutePlanningOrderStatusCell from 'src/components/delivery/RoutePlanningOrderStatusCell';

const columns: GridColDef[] = [
    {
        field: 'salesOrderId',
        headerName: ' Sales Order ID',
        flex: 1,
        valueGetter: (params: GridValueGetterParams) =>
            params.row.order?.orderId
    },
    {
        field: 'orderStatus',
        headerName: 'Delivery Status',
        flex: 1,
        renderCell: RoutePlanningOrderStatusCell,
        valueGetter: (params) => {
            let orderStatus = params.row.order?.orderStatus;
            let deliveryStatus = params.row.deliveryStatus?.status;
            let cell;

            if (deliveryStatus === 'cancelled') {
                cell = 'Cancelled';
                return cell;
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
            params.row.order?.customerAddress
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

const RoutePlanning = () => {

    const [tableData, setTableData] = React.useState<DeliveryOrder[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [latlng, setLatLng] = React.useState<any>();
    const [currentLocation, setCurrentLocation] = React.useState<string>();
    const authContext = React.useContext(AuthContext);
    const { user } = authContext;
    const [alert, setAlert] = React.useState<AlertType | null>(null);
    const [selectedDate, setSelectedDate] = React.useState<Moment | null>(
        moment()
    );

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
                        message: 'Starting location invalid, please try again!'
                    });
                } else {
                    setAlert({
                        severity: 'success',
                        message: 'Starting location set successfully.'
                    });
                }
            }
        );
    };

    const planRoute = (event: React.MouseEvent<HTMLElement>) => {
        setLoading(true);
        asyncFetchCallback(
            getPlannedRoute(selectedDate,user?.id,currentLocation),
            (res) => {
                setLoading(false);
                var newRes = res.slice(1,-1);
                setTableData(newRes);
                // console.log(newRes.length);
                // console.log(newRes);
            }
        );
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentLocation(e.target.value);
        console.log(currentLocation);
    };

    return (
        <div className='delivery-orders'>
            <Stack
                direction='row'
                width='100%'
                alignItems='center'
                justifyContent='space-between'
            >
                <h1>Route Planning</h1>
                <Stack direction='row' spacing={2}>
                    <Typography className='date-picker-text'>
                        Plan route for deliveries on
                    </Typography>
                    <DesktopDatePicker
                        label='Delivery Date'
                        value={selectedDate}
                        minDate={moment()}
                        onChange={(date) => setSelectedDate(moment(date))}
                        renderInput={(params) => (
                            <TextField style={{ width: 250 }} required {...params} />
                        )}
                    />
                </Stack>
            </Stack>
            <br></br>
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
                    Set Current Location
                </Button>
                {loading && <CircularProgress color='secondary' />}
            </div>
            {currentLocation &&
                <div className='search-bar'>
                    <h3>Your starting postal code is : {currentLocation}</h3>
                    <Button
                        variant='contained'
                        size='small'
                        sx={{ height: 'fit-content' }}
                        color='primary'
                        onClick={planRoute}
                    >
                        Plan Route
                    </Button>
                    {loading && <CircularProgress color='secondary' />}
                </div>
            }
            <br></br>
            <DataGrid
                columns={columns}
                rows={tableData}
                autoHeight
                loading={loading}
            />
        </div>
    );
};

export default RoutePlanning;
