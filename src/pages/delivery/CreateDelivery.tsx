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
  CircularProgress
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import '../../styles/pages/delivery/delivery.scss';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { SalesOrder, DeliveryOrder, ShippingType } from 'src/models/types';
import { createDeliveryOrder } from '../../services/deliveryServices';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import validator from 'validator';

//how do I look through the sales order to get sales order that I am creating a delivery order for?

const CreateDeliveryOrder= () => {
  const placeholderSupplier: DeliveryOrder = {
    id: 0,
    shippingDate: new Date(),
    shippingType: ShippingType.MANUAL,
    currentLocation: '',
    eta: new Date(),
    salesOrderId: 0,
    // salesOrder: ,
    courierType: '',
    deliveryPersonnel: '',
    method: '',
    carrier: '',
    parcelQty: 0,
    parcelWeight: 0
  };

  const navigate = useNavigate();

  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newDeliveryOrder, setNewDeliveryOrder] =
    React.useState<DeliveryOrder>(placeholderSupplier);

  const [edit, setEdit] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(true);

//to disable the button if user has not filled in all the fields
  
//   React.useEffect(() => {
//     const shouldDisable = !(
//       newDeliveryOrder?.deliveryStatus &&
//       newDeliveryOrder?.email &&
//       newDeliveryOrder?.address
//     );
//     setDisableSave(shouldDisable);
//   }, [newSupplier?.name, newSupplier?.email, newSupplier?.address]);

  const handleEditDeliveryOrder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDeliveryOrder((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (newDeliveryOrder?.shippingDate && newDeliveryOrder?.shippingType) {
      setLoading(true);
      await asyncFetchCallback(
        createDeliveryOrder(newDeliveryOrder),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Delivery Order successfully created! You will be redirected back to the All Manual Deliveries page now.'
          });
          //remember to fill in!
          setTimeout(() => navigate(''), 3500);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating delivery order: ${resData.message}`
          });
        }
      );
    }
  };

  return (
    <div>
      <Tooltip title='Return to Previous Page' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate(-1)}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>

      <div className='create-product'>
        <Box className='create-delivery-box' >
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
            <form onSubmit={handleSave}>
              <FormGroup className='create-product-form'>
                <div className='top-content'>
                  <div className='product-text-fields'>
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Shipping Type'
                      name='type'
                      value={newDeliveryOrder?.shippingType}
                      onChange={handleEditDeliveryOrder}
                      placeholder='eg.: Manual'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Delivery Status'
                      name='status'
                      value={newDeliveryOrder?.currentLocation}
                    //   error={
                    //     !validator.isEmail(newSupplier?.email) &&
                    //     !!newSupplier?.email
                    //   }
                    //   helperText={
                    //     !validator.isEmail(newSupplier?.email) &&
                    //     !!newSupplier?.email
                    //       ? 'Enter a valid email: example@email.com'
                    //       : ''
                    //   }
                      onChange={handleEditDeliveryOrder}
                    //   placeholder=''
                    />
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
                  </div>
                </div>
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() =>
                      navigate({ pathname: '' })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    className='create-btn'
                    color='primary'
                    // disabled={
                    //   disableSave ||
                    //   (!validator.isEmail(newSupplier?.email) &&
                    //     !!newSupplier?.email)
                    // }
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