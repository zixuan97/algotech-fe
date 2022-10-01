import React from 'react';
import { useNavigate } from 'react-router';
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import {
  DeliveryMode,
  DeliveryOrder,
  SalesOrder,
  ShippingType,
  User,
  UserRole
} from 'src/models/types';
import '../../styles/pages/delivery/delivery.scss';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getSalesOrderDetailsSvc } from 'src/services/salesService';
import { getAllUserSvc } from 'src/services/accountService';
import authContext from 'src/context/auth/authContext';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import {
  createManualDeliveryOrder,
  createShippitDeliveryOrder
} from 'src/services/deliveryServices';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';

const shippingType = [
  { id: 1, value: 'Manual' },
  { id: 2, value: 'Shippit' }
];

const shippitDeliveryModes = [
  { id: 1, value: DeliveryMode.STANDARD },
  { id: 2, value: DeliveryMode.EXPRESS },
  { id: 3, value: DeliveryMode.PRIORITY }
];

const shippitCarriers = [
  { id: 1, deliveryMode: DeliveryMode.STANDARD, value: 'NinjaVanStandard' },
  { id: 2, deliveryMode: DeliveryMode.STANDARD, value: 'Qxpress' },
  { id: 3, deliveryMode: DeliveryMode.STANDARD, value: 'SingPost' },
  { id: 4, deliveryMode: DeliveryMode.EXPRESS, value: 'NinjaVanExpress' },
  { id: 5, deliveryMode: DeliveryMode.EXPRESS, value: 'SingPostExpress' },
  { id: 6, deliveryMode: DeliveryMode.PRIORITY, value: 'DoorDash' },
  { id: 7, deliveryMode: DeliveryMode.PRIORITY, value: 'QxpressSameday' }
];

export type NewDeliveryOrder = Partial<DeliveryOrder> & {};

const CreateDeliveryOrder = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const { user, loadUser } = React.useContext(authContext);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [deliveryOption, setDeliveryOption] = React.useState<string>('Manual');
  const [salesOrder, setSalesOrder] = React.useState<SalesOrder>();
  const [users, setUsers] = React.useState<User[]>([]);
  const [newDeliveryOrder, setNewDeliveryOrder] =
    React.useState<NewDeliveryOrder>({});
  const [selectedDeliveryDate, setSelectedDeliveryDate] =
    React.useState<Moment>(moment().startOf('day'));
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(
        getSalesOrderDetailsSvc(id),
        (res) => {
          setSalesOrder(res);
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [id]);

  React.useEffect(() => {
    setLoading(true);
    if (user) {
      if (user.role === UserRole.ADMIN || user.role === UserRole.FULLTIME) {
        asyncFetchCallback(getAllUserSvc(), (users: Array<User>) => {
          let filteredUsers = users.filter(
            (user) => user.role !== UserRole.CUSTOMER
          );
          filteredUsers.push(user);
          setUsers(filteredUsers);
        });
      } else {
        let users: User[] = [];
        users.push(user);
        setUsers(users);
      }
    }
    setLoading(false);
  }, [user]);

  const handleEditDeliveryOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryOption(e.target.value);
  };

  const handleEditAssignedUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDeliveryOrder((prev) => ({
      ...prev,
      assignedUser: users.find((user) => user.id.toString() == e.target.value)
    }));
  };

  const handleEditDeliveryOrder = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await setNewDeliveryOrder((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleEditParcelQty = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await setNewDeliveryOrder((prev) => {
      if ((prev && e.target.value === null) || e.target.value === '') {
        return { ...prev, [e.target.name]: e.target.value };
      }

      console.log(e.target.value);
      if (prev) {
        return { ...prev, [e.target.name]: Math.floor(Number(e.target.value)) };
      } else {
        return prev;
      }
    });
  };

  const handleManualDeliveryOrderCreation = async () => {
    setLoading(true);

    let reqBody;
    if (newDeliveryOrder.assignedUser?.id) {
      reqBody = {
        shippingType: ShippingType.MANUAL,
        deliveryDate: selectedDeliveryDate,
        comments: newDeliveryOrder.comments,
        salesOrderId: Number(id),
        assignedUserId: newDeliveryOrder.assignedUser?.id
      };
    } else {
      reqBody = {
        shippingType: ShippingType.MANUAL,
        deliveryDate: selectedDeliveryDate,
        comments: newDeliveryOrder.comments,
        salesOrderId: Number(id)
      };
    }

    await asyncFetchCallback(
      createManualDeliveryOrder(reqBody),
      (res) => {
        setLoading(false);
        setAlert({
          severity: 'success',
          message: 'Manual Delivery Order successfully created!'
        });
        setTimeout(() => navigate('/delivery/allManualDeliveries'), 3000);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message:
            'Manual Delivery Order was not created successfully, please try again!'
        });
      }
    );
  };

  const handleShippitDeliveryOrderCreation = async () => {
    if (newDeliveryOrder.deliveryMode === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please select a delivery mode!'
      });
      return;
    }

    if (newDeliveryOrder.carrier) {
      let selectedCarrier = shippitCarriers.find(
        (carrier) => carrier.value === newDeliveryOrder.carrier
      );

      if (selectedCarrier?.deliveryMode !== newDeliveryOrder.deliveryMode) {
        setAlert({
          severity: 'warning',
          message:
            'Please select a carrier that matches your selected delivery mode!'
        });
        return;
      }
    }

    if (newDeliveryOrder.parcelWeight === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please input parcel weight!'
      });
      return;
    }

    if (newDeliveryOrder.parcelQty === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please input parcel quantity!'
      });
      return;
    }

    setLoading(true);

    let reqBody;
    if (newDeliveryOrder.carrier) {
      reqBody = {
        shippingType: ShippingType.SHIPPIT,
        deliveryDate: selectedDeliveryDate,
        // courierType: 'click_and_collect',
        carrier: newDeliveryOrder.carrier,
        deliveryMode: newDeliveryOrder.deliveryMode,
        salesOrderId: Number(id),
        parcelQuantity: newDeliveryOrder.parcelQty,
        parcelWeight: newDeliveryOrder.parcelWeight
      };
    } else {
      reqBody = {
        shippingType: ShippingType.SHIPPIT,
        deliveryDate: selectedDeliveryDate,
        // courierType: 'click_and_collect',
        deliveryMode: newDeliveryOrder.deliveryMode,
        salesOrderId: Number(id),
        parcelQuantity: newDeliveryOrder.parcelQty,
        parcelWeight: newDeliveryOrder.parcelWeight
      };
    }

    await asyncFetchCallback(
      createShippitDeliveryOrder(reqBody),
      (res) => {
        setLoading(false);
        setAlert({
          severity: 'success',
          message: 'Shippit Delivery Order successfully created!'
        });
        setTimeout(() => navigate('/delivery/allShippitDeliveries'), 3000);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message:
            'Shippit Delivery Order was not created successfully, please try again!'
        });
      }
    );
  };

  return (
    <div className='create-delivery-order'>
      <div className='create-delivery-order-top-section'>
        <div className='create-delivery-order-section-header'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>Create Delivery Order</h1>
        </div>
        <div className='delivery-option-dropdown-contatiner'>
          <TextField
            id='delivery-option-select-label'
            label='Shipping Type'
            name='shippingType'
            value={deliveryOption}
            onChange={handleEditDeliveryOption}
            select
            fullWidth
          >
            {shippingType.map((option) => (
              <MenuItem key={option.id} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>
      <div className='alert'>
        {alert && (
          <TimeoutAlert
            alert={alert}
            timeout={6000}
            clearAlert={() => setAlert(null)}
          />
        )}
      </div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <div className='create-delivery-order-cards'>
        <Paper elevation={2} className='create-delivery-order-card'>
          <div className='delivery-address-grid'>
            <h3 className='labelText'>Delivery Details</h3>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h4 className='labelText'>Order ID</h4>
                <TextField
                  value={salesOrder?.orderId}
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Customer Name</h4>
                <TextField
                  value={salesOrder?.customerName}
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Customer Email</h4>
                <TextField
                  value={
                    salesOrder?.customerEmail
                      ? salesOrder?.customerEmail
                      : 'Not Available'
                  }
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Contact Number</h4>
                <TextField
                  value={salesOrder?.customerContactNo}
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <h4 className='labelText'>Address</h4>
                <TextField
                  value={salesOrder?.customerAddress}
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Postal Code</h4>
                <TextField
                  value={salesOrder?.postalCode}
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
            </Grid>
          </div>
        </Paper>
        <Paper className='create-delivery-order-card'>
          <div className='delivery-input-form-grid'>
            <h3 className='labelText'>Input Delivery Order Details</h3>
            {deliveryOption === 'Manual' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <h4 className='labelText'>Delivered By</h4>
                  <div>
                    <TextField
                      id='delivery-personnel-select-label'
                      label='Delivered By'
                      name='deliveredBy'
                      value={newDeliveryOrder.assignedUser?.id}
                      onChange={handleEditAssignedUser}
                      select
                      fullWidth
                    >
                      {users.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.firstName} ({option.role})
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <h4 className='labelText'>Select Delivery Date</h4>
                  <DesktopDatePicker
                    label='Delivery Date'
                    value={selectedDeliveryDate}
                    minDate={moment('2000-01-01')}
                    onChange={(date) => setSelectedDeliveryDate(moment(date))}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <h4 className='labelText'>Comments</h4>
                  <div>
                    <TextField
                      id='comments'
                      label='Comments'
                      name='comments'
                      value={newDeliveryOrder?.comments}
                      onChange={handleEditDeliveryOrder}
                      fullWidth
                      multiline
                    />
                  </div>
                </Grid>
              </Grid>
            )}
            {deliveryOption === 'Shippit' && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <h4 className='labelText'>Courier Type</h4>
                  <TextField
                    defaultValue='click_and_collect'
                    variant='filled'
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <h4 className='labelText'>Delivery Mode</h4>
                  <TextField
                    id='deliveryMode'
                    label='Delivery Mode'
                    name='deliveryMode'
                    value={newDeliveryOrder?.deliveryMode}
                    onChange={handleEditDeliveryOrder}
                    fullWidth
                    select
                    required
                  >
                    {shippitDeliveryModes.map((option) => (
                      <MenuItem key={option.id} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {/* <Grid item xs={6}>
                  <h4 className='labelText'>Carrier</h4>
                  <TextField
                    id='carrier'
                    label='Carrier'
                    name='carrier'
                    value={newDeliveryOrder?.carrier}
                    onChange={handleEditDeliveryOrder}
                    fullWidth
                    select
                  >
                    {shippitCarriers.map((option) => (
                      <MenuItem key={option.id} value={option.value}>
                        <ListItemText inset>{option.value}</ListItemText>
                        <Typography
                          variant='subtitle1'
                          color='text.secondary'
                          style={{ display: 'flex', paddingLeft: '4rem' }}
                        >
                          {option.deliveryMode}
                        </Typography>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid> */}
                <Grid item xs={6}>
                  <h4 className='labelText'>Parcel Weight</h4>
                  <TextField
                    id='parcelWeight'
                    label='Parcel Weight (kg)'
                    name='parcelWeight'
                    type='number'
                    value={newDeliveryOrder?.parcelWeight}
                    onChange={handleEditDeliveryOrder}
                    placeholder='Eg. 10 kg'
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <h4 className='labelText'>Parcel Quantity</h4>
                  <TextField
                    id='parcelQty'
                    label='Parcel Quantity'
                    name='parcelQty'
                    type='number'
                    value={newDeliveryOrder?.parcelQty}
                    onChange={handleEditParcelQty}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <h4 className='labelText'>Select Delivery Date</h4>
                  <DesktopDatePicker
                    label='Delivery Date'
                    value={selectedDeliveryDate}
                    minDate={moment('2000-01-01')}
                    onChange={(date) => setSelectedDeliveryDate(moment(date))}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            )}
          </div>
        </Paper>
      </div>
      <div className='create-delivery-button-container'>
        <Button
          variant='contained'
          size='medium'
          sx={{ height: 'fit-content' }}
          onClick={
            deliveryOption === 'Manual'
              ? handleManualDeliveryOrderCreation
              : handleShippitDeliveryOrderCreation
          }
        >
          Create Delivery Order
        </Button>
      </div>
    </div>
  );
};

export default CreateDeliveryOrder;
