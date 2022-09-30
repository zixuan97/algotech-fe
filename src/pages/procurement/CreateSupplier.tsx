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
  Alert
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { Supplier } from '../../models/types';
import { createSupplier } from '../../services/supplierService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import validator from 'validator';
import { isValidSupplier } from 'src/components/procurement/procurementHelper';
import SupplierProductEditGrid from 'src/components/procurement/SupplierProductEditGrid';

export type NewSupplier = Partial<Supplier> & {};

const CreateSupplier = () => {
  const navigate = useNavigate();

  const [disableSave, setDisableSave] = React.useState<boolean>(true);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  
  const [newSupplier, setNewSupplier] = React.useState<NewSupplier>({
    email: '',
    supplierProduct: []
  });

  React.useEffect(() => {
    setDisableSave(!isValidSupplier(newSupplier));
  }, [newSupplier]);

  const handleEditSupplier = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNumber: boolean = false
  ) => {
    const value = isNumber ? parseInt(e.target.value) : e.target.value;
    setNewSupplier((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (newSupplier) {
      setLoading(true);
      await asyncFetchCallback(
        createSupplier(newSupplier as Supplier),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Supplier successfully created! You will be redirected back to the All Suppliers page now.'
          });
          setTimeout(() => navigate('/procurementOrders/allSuppliers'), 3500);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating supplier: ${resData.message}`
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
                      placeholder='eg.: Packaging Supplier'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Supplier Email'
                      name='email'
                      value={newSupplier?.email}
                      error={
                        !validator.isEmail(newSupplier?.email!) &&
                        !!newSupplier?.email
                      }
                      helperText={
                        !validator.isEmail(newSupplier?.email!) &&
                        !!newSupplier?.email
                          ? 'Enter a valid email: example@email.com'
                          : ''
                      }
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
                <SupplierProductEditGrid
                  supplierProductList={newSupplier.supplierProduct ?? []}
                  updateSupplierProductList={(pdts) =>
                    setNewSupplier((prev) => ({
                      ...prev,
                      supplierProduct: pdts
                    }))
                  }
                />
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
                    disabled={
                      disableSave ||
                      (!validator.isEmail(newSupplier?.email!) &&
                        !!newSupplier?.email)
                    }
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
