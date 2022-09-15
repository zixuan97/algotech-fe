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
import { Brand } from '../../models/types';
import { createBrand } from '../../services/brandService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { AlertType } from '../../components/common/TimeoutAlert';
import { toast } from 'react-toastify';

export type NewBrand = Partial<Brand>;

const CreateBrand = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newBrand, setNewBrand] = React.useState<NewBrand>({});

  const handleEditBrand = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBrand((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (newBrand) {
      setLoading(true);
      await asyncFetchCallback(
        createBrand(newBrand),
        () => {
          setLoading(false);
          toast.success('Brand successfully created!', {
            position: 'top-right',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          navigate('/inventory/allBrands');
          // setAlert({
          //   severity: 'success',
          //   message: 'Brand successfully created!'
          // });
        },
        (err) => {
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating brand: ${err.message}`
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
            <h1>Create Brand</h1>
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
                      label='Brand Name'
                      name='name'
                      value={newBrand?.name}
                      onChange={handleEditBrand}
                      placeholder='eg.: Kettle Gourmet'
                    />
                  </div>
                </div>
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() =>
                      navigate({ pathname: '/inventory/allBrands' })
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
                    Create Brand
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

export default CreateBrand;
