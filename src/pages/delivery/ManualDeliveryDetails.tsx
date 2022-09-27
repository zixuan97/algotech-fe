import React from 'react';
import { useNavigate } from 'react-router';
import {
  Tooltip,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import {
  PlaylistAddCheckCircleRounded,
  LocalShippingRounded,
  TaskAltRounded
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { DeliveryOrder, User, UserRole } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getDeliveryOrderById } from 'src/services/deliveryServices';
import { getAllUserSvc } from 'src/services/accountService';
import authContext from 'src/context/auth/authContext';

const steps = [
  {
    label: 'Ready for Delivery',
    icon: <PlaylistAddCheckCircleRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Out for Delivery'
  },
  {
    label: 'Out for Delivery',
    icon: <LocalShippingRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Order Delivered'
  },
  {
    label: 'Order Delivered',
    icon: <TaskAltRounded sx={{ fontSize: 35 }} />
  }
];

const ManualDeliveryDetails = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const { user, loadUser } = React.useContext(authContext);

  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [originalDeliveryOrder, setOriginalDeliveryOrder] =
    React.useState<DeliveryOrder>();
  const [updatedDeliveryOrder, setUpdatedDeliveryOrder] =
    React.useState<DeliveryOrder>();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(
        getDeliveryOrderById(id),
        (res) => {
          setOriginalDeliveryOrder(res);
          setUpdatedDeliveryOrder(res);
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
          setUsers(users);
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
    <div className='view-delivery-details'>
      <div className='view-delivery-details-top-section'>
        <div className='delivery-details-section-header'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>View Manual Delivery Order ID: #1</h1>
        </div>
        <div className='delivery-edit-button-container'>
          <Button
            variant='contained'
            onClick={() => {
              if (!edit) {
                setEdit(true);
              } else {
                // handleOrderUpdate();
                setEdit(false);
              }
            }}
          >
            {edit ? 'Save Changes' : 'Edit'}
          </Button>
          {!edit && <Button variant='contained'>Cancel Delivery</Button>}
          {edit && (
            <Button
              variant='contained'
              size='medium'
              sx={{ width: 'fit-content' }}
              onClick={() => {}}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      <div className='delivery-details-stepper'>
        <Stepper activeStep={0} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel icon={step.icon}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className='delivery-details-action-section'>
        <Paper elevation={2} className='delivery-details-action-card'>
          <Typography sx={{ fontSize: 'inherit' }}>Next Action:</Typography>
          <Button variant='contained' size='medium' onClick={() => {}}>
            {steps[activeStep].nextAction}
          </Button>
        </Paper>
      </div>
      <div className='delivery-detail-cards'>
        <Paper elevation={2} className='delivery-address-card'>
          <div className='delivery-address-grid'>
            <h3 className='labelText'>Delivery Address</h3>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <h4 className='labelText'>Name</h4>
                <Typography>John Tan</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Address Line 1</h4>
                <Typography>123 Bedok Road</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Address Line 2</h4>
                <Typography>#01-09</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Country</h4>
                <Typography>Singapore</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Postal Code</h4>
                <Typography>434503</Typography>
              </Grid>
            </Grid>
          </div>
        </Paper>
        <Paper elevation={2} className='delivery-mode-card'>
          <div className='delivery-mode-grid'>
            <h3 className='labelText'>Delivery Mode</h3>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h4 className='labelText'>Delivery Method</h4>
                <Typography>Manual Delivery</Typography>
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Delivered By</h4>
                {edit ? (
                  <div>
                    <TextField
                      id='delivery-personnel-select-label'
                      label='Delivered By'
                      name='deliveredBy'
                      value={''}
                      onChange={() => {}}
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
                ) : (
                  <div>
                    <Typography>Jane (Intern)</Typography>
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <h4 className='labelText'>Comments</h4>
                {edit ? (
                  <TextField
                    id='outlined-required'
                    label='Comments'
                    name=''
                    value={''}
                    onChange={() => {}}
                    placeholder='Enter updated comments here.'
                    fullWidth
                    multiline
                  />
                ) : (
                  <Typography>
                    Jane will deliver otw to work on Monday.
                  </Typography>
                )}
              </Grid>
              <div className='delivery-actions-button-container'>
                <Button
                  variant='contained'
                  size='medium'
                  sx={{ height: 'fit-content' }}
                  onClick={() => {}}
                >
                  Download DO
                </Button>

                <Button
                  variant='contained'
                  size='medium'
                  sx={{ height: 'fit-content' }}
                  onClick={() => {}}
                >
                  Download Waybill
                </Button>
              </div>
            </Grid>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default ManualDeliveryDetails;
