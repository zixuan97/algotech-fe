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
  MenuItem,
  Backdrop,
  CircularProgress,
  StepContent
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import {
  PlaylistAddCheckCircleRounded,
  LocalShippingRounded,
  TaskAltRounded
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { DeliveryOrder, OrderStatus, User, UserRole } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  editDeliveryOrder,
  getDeliveryOrderById
} from 'src/services/deliveryServices';
import { getAllUserSvc } from 'src/services/accountService';
import authContext from 'src/context/auth/authContext';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import apiRoot from 'src/services/util/apiRoot';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import moment from 'moment';

const steps = [
  {
    currentState: OrderStatus.READY_FOR_DELIVERY,
    label: 'Delivery Scheduled',
    icon: <PlaylistAddCheckCircleRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Order Shipped'
  },
  {
    currentState: OrderStatus.SHIPPED,
    label: 'Order Shipped',
    icon: <LocalShippingRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Order Delivered'
  },
  {
    currentState: OrderStatus.COMPLETED,
    label: 'Order Received',
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
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [cancelDeliveryModalOpen, setCancelDeliveryModalOpen] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(
        getDeliveryOrderById(id),
        (res) => {
          setOriginalDeliveryOrder(res);
          setUpdatedDeliveryOrder(res);
          setActiveStep(
            steps.findIndex(
              (step) => step.currentState === res.salesOrder.orderStatus
            )
          );
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

  const handleCancelUpdate = async () => {
    setEdit(false);
    setUpdatedDeliveryOrder(originalDeliveryOrder);
  };

  const handleEditDeliveryOrder = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await setUpdatedDeliveryOrder((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleEditAssignedUser = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newAssignedUser = users.find(
      (user) => user.id.toString() == e.target.value
    );

    await setUpdatedDeliveryOrder((prev) => {
      if (prev) {
        return { ...prev, assignedUser: newAssignedUser };
      } else {
        return prev;
      }
    });
  };

  const handleDeliveryOrderUpdate = async () => {
    setLoading(true);

    let reqBody = {
      id: originalDeliveryOrder?.id,
      comments: updatedDeliveryOrder?.comments,
      salesOrderId: originalDeliveryOrder?.salesOrderId,
      assignedUserId: updatedDeliveryOrder?.assignedUser?.id
    };

    await asyncFetchCallback(
      editDeliveryOrder(reqBody),
      (res) => {
        setOriginalDeliveryOrder((originalDeliveryOrder) => {
          if (originalDeliveryOrder) {
            return {
              ...originalDeliveryOrder,
              comments: updatedDeliveryOrder!.comments,
              assignedUser: updatedDeliveryOrder!.assignedUser
            };
          } else {
            return originalDeliveryOrder;
          }
        });
        setAlert({
          severity: 'success',
          message: 'Delivery Order updated successfully.'
        });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message: 'Delivery Order was not updated successfully.'
        });
      }
    );
  };

  const handleDeliveryOrderStatusUpdate = async () => {
    setModalOpen(false);
    setLoading(true);

    setActiveStep((prev) => prev + 1);

    let reqBody = {
      id: originalDeliveryOrder?.id,
      salesOrderId: originalDeliveryOrder?.salesOrderId,
      assignedUserId: originalDeliveryOrder?.assignedUser?.id,
      orderStatus:
        originalDeliveryOrder?.salesOrder.orderStatus ===
        OrderStatus.READY_FOR_DELIVERY
          ? OrderStatus.SHIPPED
          : OrderStatus.COMPLETED
    };

    await asyncFetchCallback(
      editDeliveryOrder(reqBody),
      (res) => {
        let updatedOrderStatus;
        if (
          originalDeliveryOrder?.salesOrder.orderStatus ===
          OrderStatus.READY_FOR_DELIVERY
        ) {
          updatedOrderStatus = OrderStatus.SHIPPED;
        } else {
          updatedOrderStatus = OrderStatus.COMPLETED;
        }

        let updatedOrder = Object.assign(
          {},
          originalDeliveryOrder?.salesOrder,
          { orderStatus: updatedOrderStatus }
        );

        setOriginalDeliveryOrder((originalDeliveryOrder) => {
          if (originalDeliveryOrder) {
            return {
              ...originalDeliveryOrder,
              salesOrder: updatedOrder
            };
          } else {
            return originalDeliveryOrder;
          }
        });
        setAlert({
          severity: 'success',
          message: 'Delivery Order Status updated successfully.'
        });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message: 'Delivery Order Status was not updated successfully.'
        });
      }
    );
  };

  const handleCancelDeliveryOrder = async () => {
    setCancelDeliveryModalOpen(false);
    setLoading(true);

    setActiveStep((prev) => prev + 1);

    let reqBody = {
      id: originalDeliveryOrder?.id,
      salesOrderId: originalDeliveryOrder?.salesOrderId,
      assignedUserId: originalDeliveryOrder?.assignedUser?.id,
      orderStatus: OrderStatus.CANCELLED
    };

    await asyncFetchCallback(
      editDeliveryOrder(reqBody),
      (res) => {
        let updatedOrder = Object.assign(
          {},
          originalDeliveryOrder?.salesOrder,
          { orderStatus: OrderStatus.CANCELLED }
        );

        setOriginalDeliveryOrder((originalDeliveryOrder) => {
          if (originalDeliveryOrder) {
            return {
              ...originalDeliveryOrder,
              salesOrder: updatedOrder
            };
          } else {
            return originalDeliveryOrder;
          }
        });
        setAlert({
          severity: 'success',
          message: 'Delivery Order cancelled.'
        });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message: 'Delivery Order was not cancelled successfully.'
        });
      }
    );
  };

  const handleDownloadDeliveryOrder = async () => {
    if (id) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', `${apiRoot}/delivery/pdf/${id}`, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
        if (this.status == 200) {
          var blob = new Blob([this.response], {
            type: 'application/pdf'
          });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          let deliveryDate = moment(originalDeliveryOrder?.deliveryDate).format(
            'DDMMYYYY'
          );
          link.download = `DeliveryOrder-${deliveryDate}`;
          link.click();
        }
      };
      xhr.send();
    }
  };

  return (
    <div className='view-delivery-details'>
      <div className='view-delivery-details-top-section'>
        <div className='delivery-details-section-header'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>View Manual Delivery Order ID: #{originalDeliveryOrder?.id}</h1>
        </div>
        <div className='delivery-edit-button-container'>
          <Button
            variant='contained'
            onClick={() => {
              if (!edit) {
                setEdit(true);
              } else {
                handleDeliveryOrderUpdate();
                setEdit(false);
              }
            }}
          >
            {edit ? 'Save Changes' : 'Edit'}
          </Button>
          {!edit && activeStep === 0 && (
            <Button
              variant='contained'
              onClick={() => setCancelDeliveryModalOpen(true)}
            >
              Cancel Delivery
            </Button>
          )}
          <ConfirmationModal
            open={cancelDeliveryModalOpen}
            onClose={() => setCancelDeliveryModalOpen(false)}
            onConfirm={handleCancelDeliveryOrder}
            title='Cancel Delivery Over'
            body='Are you sure you want to cancel the delivery order? This action cannot be reversed.'
          />
          {edit && (
            <Button
              variant='contained'
              size='medium'
              sx={{ width: 'fit-content' }}
              onClick={handleCancelUpdate}
            >
              Cancel
            </Button>
          )}
        </div>
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
      {alert && (
        <div className='delivery-details-alert'>
          <TimeoutAlert
            alert={alert}
            timeout={6000}
            clearAlert={() => setAlert(null)}
          />
        </div>
      )}
      <div className='delivery-details-stepper'>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel icon={step.icon}>
                {step.label}
                20/09/2022
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      {activeStep !== 2 && (
        <div className='delivery-details-action-section'>
          <Paper elevation={2} className='delivery-details-action-card'>
            <Typography sx={{ fontSize: 'inherit' }}>Next Action:</Typography>
            <Button
              variant='contained'
              size='medium'
              onClick={() => setModalOpen(true)}
            >
              {steps[activeStep].nextAction}
            </Button>
            <ConfirmationModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={handleDeliveryOrderStatusUpdate}
              title='Update Delivery Status'
              body='Are you sure you want to update the delivery status? This action cannot be reversed.'
            />
          </Paper>
        </div>
      )}
      <div className='delivery-detail-cards'>
        <Paper elevation={2} className='delivery-address-card'>
          <div className='delivery-address-grid'>
            <h3 className='labelText'>Delivery Address</h3>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <h4 className='labelText'>Name</h4>
                <Typography>
                  {originalDeliveryOrder?.salesOrder.customerName}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <h4 className='labelText'>Address</h4>
                <Typography>
                  {originalDeliveryOrder?.salesOrder.customerAddress}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Country</h4>
                <Typography>Singapore</Typography>
              </Grid>
              <Grid item xs={4}>
                <h4 className='labelText'>Postal Code</h4>
                <Typography>
                  {originalDeliveryOrder?.salesOrder.postalCode}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Paper>
        <Paper elevation={2} className='delivery-mode-card'>
          <div className='delivery-mode-grid'>
            <h3 className='labelText'>Delivery Details</h3>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h4 className='labelText'>Delivery Method</h4>
                <Typography>{originalDeliveryOrder?.shippingType}</Typography>
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Delivered By</h4>
                {edit ? (
                  <div>
                    <TextField
                      id='delivery-personnel-select-label'
                      label='Delivered By'
                      name='deliveredBy'
                      value={updatedDeliveryOrder?.assignedUser?.id}
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
                ) : (
                  <div>
                    <Typography>
                      {originalDeliveryOrder?.assignedUser?.firstName} (
                      {originalDeliveryOrder?.assignedUser?.role})
                    </Typography>
                  </div>
                )}
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Delivery Date</h4>
                <Typography>
                  {moment(originalDeliveryOrder?.deliveryDate).format(
                    'DD/MM/YYYY'
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <h4 className='labelText'>Comments</h4>
                {edit ? (
                  <TextField
                    id='outlined-required'
                    label='Comments'
                    name='comments'
                    value={updatedDeliveryOrder?.comments}
                    onChange={handleEditDeliveryOrder}
                    placeholder='Enter updated comments here.'
                    fullWidth
                    multiline
                  />
                ) : (
                  <Typography>
                    {originalDeliveryOrder?.comments
                      ? originalDeliveryOrder?.comments
                      : 'No comments'}
                  </Typography>
                )}
              </Grid>
              <div className='delivery-actions-button-container'>
                <Button
                  variant='outlined'
                  startIcon={<PictureAsPdfIcon />}
                  size='medium'
                  sx={{ height: 'fit-content' }}
                  onClick={handleDownloadDeliveryOrder}
                >
                  Download DO
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
