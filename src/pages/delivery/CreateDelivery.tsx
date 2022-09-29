import React, { FormEvent } from 'react';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Backdrop,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import '../../styles/pages/delivery/delivery.scss';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { SalesOrder, DeliveryOrder } from 'src/models/types';
import { createDeliveryOrder } from '../../services/deliveryServices';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import validator from 'validator';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';

const CreateDeliveryOrder = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newDeliveryOrder, setNewDeliveryOrder] =
    React.useState<DeliveryOrder>();
  const [salesOrder, setSalesOrder] = React.useState<SalesOrder>();

  const [edit, setEdit] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(true);

  const [date, setDate] = React.useState<Dayjs | null>(
    dayjs('2022-09-18T21:11:54')
  );

  const handleDateChange = (newDate: Dayjs | null) => {
    setDate(newDate);
  };

  const handleEditDeliveryOrder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDeliveryOrder((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  // const handleSave = async (e: FormEvent) => {
  //   e.preventDefault();

  //   if (newDeliveryOrder?.shippingDate && newDeliveryOrder?.shippingType) {
  //     setLoading(true);
  //     await asyncFetchCallback(
  //       createDeliveryOrder(newDeliveryOrder),
  //       () => {
  //         setLoading(false);
  //         setAlert({
  //           severity: 'success',
  //           message:
  //             'Delivery Order successfully created! You will be redirected back to the All Manual Deliveries page now.'
  //         });
  //         //remember to fill in!
  //         setTimeout(() => navigate(''), 3500);
  //       },
  //       (err) => {
  //         const resData = err.response?.data as AxiosErrDataBody;
  //         setLoading(false);
  //         setAlert({
  //           severity: 'error',
  //           message: `Error creating delivery order: ${resData.message}`
  //         });
  //       }
  //     );
  //   }
  // };

  const handleDeliveryCreation = async () => {
    if (newDeliveryOrder?.currentLocation === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please Select Delivery Location!'
      });
      return;
    }

    if (newDeliveryOrder?.shippingType === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please Select Shipping Type!'
      });
      return;
    }

    if (newDeliveryOrder?.deliveryDate === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please Select Delivery Date!'
      });
      return;
    }

    setLoading(true);

    let reqBody = {
      ShippingType: newDeliveryOrder.shippingType,
      courierType: newDeliveryOrder.courierType,
      deliveryDate: newDeliveryOrder.deliveryDate,
      deliveryPersonnel: '',
      method: newDeliveryOrder.method,
      // status: salesOrder.orderStatus,
      parcelQty: newDeliveryOrder.parcelQty,
      parcelWeight: newDeliveryOrder.parcelWeight,
      salesOrderId: newDeliveryOrder.salesOrderId
    };

    await asyncFetchCallback(
      createDeliveryOrder(reqBody),
      (res) => {
        setLoading(false);
        setAlert({
          severity: 'success',
          message:
            'Delivery Order successfully created! You will be redirected back to the All Manual Deliveries page now.'
        });
        setTimeout(() => navigate(''), 3000);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message: 'Error creating delivery order!'
        });
      }
    );
  };

  return (
    <div>
      <Tooltip title='Return to Previous Page' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate(-1)}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>

      <div className='create-product'>
        <Box className='create-delivery-box'>
          <div className='header-content'>
            <h1>Create Delivery Order</h1>
          </div>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          <Paper elevation={2}>
            <Backdrop
              sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1
              }}
              open={loading}
            >
              <CircularProgress color='inherit' />
            </Backdrop>
            <form onSubmit={handleDeliveryCreation}>
              <FormGroup className='create-product-form'>
                <div className='top-content'>
                  <div className='product-text-fields'>
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Shipping Address'
                      name='address'
                      value={newDeliveryOrder?.currentLocation}
                      onChange={handleEditDeliveryOrder}
                      placeholder='eg.: 123 Clementi Road, #01-01, Singapore 12345'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Shipping Type'
                      name='type'
                      value={newDeliveryOrder?.shippingType}
                      onChange={handleEditDeliveryOrder}
                      placeholder='eg.: Manual'
                      // {.map((option) => (
                      //   <option key={option.value} value={option.value}>
                      //     {option.label}
                      //   </option>
                      // ))}
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Courier Type'
                      name='status'
                      value={newDeliveryOrder?.courierType}
                      onChange={handleEditDeliveryOrder}
                      placeholder='eg.: Standard'
                    />
                    <DesktopDatePicker
                      label='Delivery Date'
                      inputFormat='MM/DD/YYYY'
                      value={date}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Delivery Personnel'
                      value={''}
                      onChange={handleEditDeliveryOrder}
                      placeholder='eg.: Delivery Man'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Delivery Method'
                      value={newDeliveryOrder?.method}
                      onChange={handleEditDeliveryOrder}
                      placeholder='eg.: Standard'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Carrier'
                      value={newDeliveryOrder?.carrier}
                      onChange={handleEditDeliveryOrder}
                      placeholder='eg.: Ninjavan'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Status'
                      value={newDeliveryOrder?.salesOrder.orderStatus}
                      onChange={handleEditDeliveryOrder}
                    />
                    <TextField
                      type='number'
                      required
                      fullWidth
                      id='outlined-required'
                      label='Parcel Quantity'
                      value={newDeliveryOrder?.parcelQty}
                      onChange={handleEditDeliveryOrder}
                    />
                    <TextField
                      type='number'
                      required
                      fullWidth
                      id='outlined-required'
                      label='Parcel Weight'
                      value={newDeliveryOrder?.parcelWeight}
                      onChange={handleEditDeliveryOrder}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>kg</InputAdornment>
                        )
                      }}
                    />
                  </div>
                </div>
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() => navigate({ pathname: '' })}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    className='create-btn'
                    color='primary'
                  >
                    Create Delivery Order
                  </Button>
                </div>
              </FormGroup>
            </form>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default CreateDeliveryOrder;
