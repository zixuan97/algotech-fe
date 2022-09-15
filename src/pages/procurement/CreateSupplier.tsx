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
import { createLocation } from '../../services/locationService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { AlertType } from '../../components/common/Alert';
import { toast } from 'react-toastify';

export type NewSupplier = Partial<Supplier>;

const CreateSupplier = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newSupplier, setNewSupplier] = React.useState<NewSupplier>({});

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

    if (newSupplier) {
      setLoading(true);
      await asyncFetchCallback(
        createLocation(newSupplier),
        () => {
          setLoading(false);
          toast.success('Supplier successfully created!', {
            position: 'top-right',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          navigate('/orders/allSuppliers');
          // setAlert({
          //   severity: 'success',
          //   message: 'Warehouse successfully created!'
          // });
          // setTimeout(() => {navigate('/inventory/warehouses')}, 3000);
        },
        (err) => {
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating supplier: ${err.message}`
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
          {alert && (
            <Alert severity={alert.severity} onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          )}
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
                      placeholder='eg.: Chai Chee Warehouse'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Supplier Email'
                      name='email'
                      value={newSupplier?.email}
                      onChange={handleEditSupplier}
                      placeholder='eg.: john@gmail.com'
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
