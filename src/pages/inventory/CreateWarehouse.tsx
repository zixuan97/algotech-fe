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
import { Location } from '../../models/types';
import { createLocation } from '../../services/locationService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { AlertType } from '../../components/common/Alert';
import { toast } from 'react-toastify';

export type NewLocation = Partial<Location>;

const CreateWarehouse = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newLocation, setNewLocation] = React.useState<NewLocation>({});

  const handleEditLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLocation((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (newLocation) {
      setLoading(true);
      await asyncFetchCallback(
        createLocation(newLocation),
        () => {
          setLoading(false);
          toast.success(
            'Warehouse successfully created!',
            {
              position: 'top-right',
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined
            }
          );
          navigate('/inventory/warehouses');

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
            message: `Error creating warehouse: ${err.message}`
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
            <h1>Create Warehouse</h1>
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
                      label='Warehouse Name'
                      name='name'
                      value={newLocation?.name}
                      onChange={handleEditLocation}
                      placeholder='eg.: Chai Chee Warehouse'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Address'
                      name='address'
                      value={newLocation?.address}
                      onChange={handleEditLocation}
                      placeholder='eg.: 123 Chai Chee Road, #01-02, Singapore 12345'
                    />
                  </div>
                </div>
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() =>
                      navigate({ pathname: '/inventory/warehouses' })
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
                    Create Warehouse
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

export default CreateWarehouse;
