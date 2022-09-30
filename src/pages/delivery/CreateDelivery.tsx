import React from 'react';
import { useNavigate } from 'react-router';
import {
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { SalesOrder, User, UserRole } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getSalesOrderDetailsSvc } from 'src/services/salesService';
import { getAllUserSvc } from 'src/services/accountService';
import authContext from 'src/context/auth/authContext';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

const shippingType = [
  { id: 1, value: 'Manual' },
  { id: 2, value: 'Shippit' }
];

const CreateDeliveryOrder = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const { user, loadUser } = React.useContext(authContext);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [deliveryOption, setDeliveryOption] = React.useState<string>('Manual');
  const [salesOrder, setSalesOrder] = React.useState<SalesOrder>();
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(
        getSalesOrderDetailsSvc(id),
        (res) => {
          console.log(res);
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
            onChange={() => {}}
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
      <div className='create-delivery-order-cards'>
        <Paper elevation={2} className='create-delivery-order-card'>
          <div className='delivery-address-grid'>
            <h3 className='labelText'>Delivery Details</h3>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label='Order ID'
                  defaultValue='12938'
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Name'
                  defaultValue='John Tan'
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Email'
                  defaultValue='john@gmail.com'
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Contact Number'
                  defaultValue='92837191'
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Address'
                  defaultValue='123 Bedok Road, #01-08'
                  variant='filled'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Postal Code'
                  defaultValue='482762'
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h4 className='labelText'>Delivered By</h4>
                <div>
                  <TextField
                    id='delivery-personnel-select-label'
                    label='Delivered By'
                    name='deliveredBy'
                    value=''
                    onChange={() => {}}
                    select
                    fullWidth
                    required
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
                  value=''
                  minDate={moment('2000-01-01')}
                  onChange={() => {}}
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
                    value=''
                    onChange={() => {}}
                    fullWidth
                    multiline
                    required
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default CreateDeliveryOrder;
