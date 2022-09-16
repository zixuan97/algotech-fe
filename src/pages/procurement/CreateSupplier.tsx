import React, { FormEvent } from 'react';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Alert,
  Backdrop,
  CircularProgress
  // Snackbar,
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { Supplier } from '../../models/types';
import { createSupplier } from '../../services/supplierService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import { toast } from 'react-toastify';
import validator from 'validator';

// export type NewSupplier = Partial<Supplier>;

const CreateSupplier = () => {
  const placeholderSupplier: Supplier = {
    id: 0,
    email: '',
    name: '',
    address: '',
    proc_order_items: []
  };

  const navigate = useNavigate();

  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newSupplier, setNewSupplier] = React.useState<Supplier>(placeholderSupplier);

  const [edit, setEdit] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(true);

  React.useEffect(() => {
    const shouldDisable = !(
      newSupplier?.name &&
      newSupplier?.email &&
      newSupplier?.address
    );
    setDisableSave(shouldDisable);
  }, [newSupplier?.name, newSupplier?.email, newSupplier?.address]);

  const handleEditSupplier = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSupplier((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (
      newSupplier?.name &&
      newSupplier?.email &&
      newSupplier?.address
    ) {
      setLoading(true);
      await asyncFetchCallback(
        createSupplier(newSupplier),
        () => {
          setLoading(false);
          // toast.success('Supplier successfully created!', {
          //   position: 'top-right',
          //   autoClose: 6000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined
          // });
          // navigate('/orders/allSuppliers');
          setAlert({
            severity: 'success',
            message: 'Supplier successfully created! You will be redirected back to the All Suppliers page now.'
          });
          setTimeout(() => navigate('/orders/allSuppliers'), 3500);
        },
        (err) => {
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating supplier: ${err.message}. Try again later.`
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
        <Box className='create-product-box'>
          <div className='header-content'>
            <h1>Create Supplier</h1>
          </div>
          {/* {alert && (
            <Alert severity={alert.severity} onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          )} */}
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
                      label='Supplier Name'
                      name='name'
                      value={newSupplier?.name}
                      onChange={handleEditSupplier}
                      placeholder='eg.: Packaging Supplier'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Supplier Email'
                      name='email'
                      value={newSupplier?.email}
                      error={!validator.isEmail(newSupplier?.email) && !!newSupplier?.email}
                      helperText={
                        !validator.isEmail(newSupplier?.email) && !!newSupplier?.email
                          ? 'Enter a valid email: example@email.com'
                          : ''}
                      onChange={handleEditSupplier}
                      placeholder='eg.: johntan@gmail.com'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Supplier Address'
                      name='address'
                      value={newSupplier?.address}
                      onChange={handleEditSupplier}
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
                      navigate({ pathname: '/orders/allSuppliers' })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    className='create-btn'
                    color='primary'
                    disabled={disableSave || (!validator.isEmail(newSupplier?.email) && !!newSupplier?.email)}
                  >
                    Create Supplier
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

export default CreateSupplier;
