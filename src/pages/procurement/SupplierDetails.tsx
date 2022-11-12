import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Autocomplete,
  Backdrop,
  Box,
  FormGroup,
  TextField,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { Supplier, SupplierProduct } from '../../models/types';
import {
  deleteSupplier,
  getSupplierById,
  updateSupplier,
  getAllCurrencies
} from '../../services/supplierService';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import validator from 'validator';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import { isValidSupplier } from 'src/components/procurement/procurementHelper';
import SupplierProductEditGrid from 'src/components/procurement/SupplierProductEditGrid';
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridValueGetterParams
} from '@mui/x-data-grid';
import ProductCellAction from 'src/components/inventory/ProductCellAction';

const SupplierDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const current = useLocation();
  const supplier = current.state as Supplier;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [tableLoading, setTableLoading] = React.useState<boolean>(false);
  const [backdropLoading, setBackdropLoading] = React.useState<boolean>(false);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [originalSupplier, setOriginalSupplier] =
    React.useState<Supplier>(supplier);
  const [editSupplier, setEditSupplier] = React.useState<Supplier>(supplier);
  const [supplierProducts, setSupplierProducts] = React.useState<
    SupplierProduct[]
  >([]);

  const [currencies, setCurrencies] = React.useState<string[]>([]);

  const [edit, setEdit] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(true);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 2,
      valueGetter: (params: GridValueGetterParams) => params.row.product.name
    },
    {
      field: 'rate',
      renderHeader: (params: GridColumnHeaderParams) => (
        <div style={{ fontWeight: '500' }}>{`Rate (${
          editSupplier?.currency.split(' - ')[0]
        })`}</div>
      ),
      headerAlign: 'right',
      align: 'right',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      renderCell: ProductCellAction
    }
  ];

  React.useEffect(() => {
    id &&
      asyncFetchCallback(getSupplierById(id), (supplier: Supplier) => {
        if (supplier) {
          setOriginalSupplier(supplier);
          console.log(originalSupplier);
          setEditSupplier(supplier);
          setLoading(false);
        } else {
          setAlert({
            severity: 'error',
            message:
              'Supplier does not exist. You will be redirected back to the All Suppliers page.'
          });
          setLoading(false);
          setTimeout(() => navigate('/procurementOrders/allSuppliers'), 3500);
        }
      });
  }, [id, navigate]);

  React.useEffect(() => {
    setDisableSave(!isValidSupplier(editSupplier));
  }, [editSupplier]);

  React.useEffect(() => {
    setTableLoading(true);
    if (id) {
      asyncFetchCallback(getSupplierById(id), (res) => {
        setOriginalSupplier(res);
        setEditSupplier(res);
        console.log('editSupplier', editSupplier);

        setSupplierProducts(res.supplierProduct);
        setTableLoading(false);

        setLoading(false);
      });
      asyncFetchCallback(getAllCurrencies(), (res) => {
        setCurrencies(res);
      });
    }
  }, [id]);

  React.useEffect(() => {
    setTableLoading(true);
    if (id) {
      asyncFetchCallback(getSupplierById(id), (res) => {
        setSupplierProducts(res.supplierProduct);
        setTableLoading(false);
      });
    }
  }, [id, editSupplier, originalSupplier]);

  const handleDeleteButtonClick = () => {
    setModalOpen(false);
    setBackdropLoading(true);
    if (originalSupplier) {
      asyncFetchCallback(
        deleteSupplier(originalSupplier.id),
        () => {
          setBackdropLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Supplier successfully deleted. You will be redirected back to the All Suppliers page now.'
          });
          setTimeout(() => navigate('/procurementOrders/allSuppliers'), 3500);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setBackdropLoading(false);
          setAlert({
            severity: 'success',
            message: `Error deleting supplier: ${resData.message}`
          });
        }
      );
    }
  };

  const handleFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditSupplier((supplier: Supplier) => {
      return {
        ...supplier,
        [key]: event.target.value
      };
    });
  };

  const handleSave = async () => {
    if (editSupplier) {
      setBackdropLoading(true);
      asyncFetchCallback(
        updateSupplier(editSupplier),
        () => {
          setAlert({
            severity: 'success',
            message: 'Supplier successfully edited.'
          });
          setBackdropLoading(false);
          setEditSupplier(editSupplier);
          setOriginalSupplier(editSupplier);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setBackdropLoading(false);
          setAlert({
            severity: 'error',
            message: `Error editing supplier: ${resData.message}`
          });
        }
      );
    }
  };

  const title = `${edit ? 'Edit' : ''} Supplier Details`;

  return (
    <div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={backdropLoading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <Tooltip title='Return to Previous Page' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate(-1)}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>
      <div className='create-product'>
        <Box className='create-product-box'>
          <div className='header-content'>
            <h1>{title}</h1>
            <div className='button-group'>
              {loading && <CircularProgress color='secondary' />}
              <Button
                variant='contained'
                className='create-btn'
                color='primary'
                disabled={edit && disableSave}
                onClick={() => {
                  if (!edit) {
                    setEdit(true);
                  } else {
                    handleSave();
                    setEdit(false);
                  }
                }}
              >
                {edit ? 'Save Changes' : 'Edit'}
              </Button>
              {edit && (
                <Button
                  variant='contained'
                  className='create-btn'
                  color='primary'
                  onClick={() => {
                    setEdit(false);
                    setEditSupplier(originalSupplier);
                  }}
                >
                  Discard Changes
                </Button>
              )}
              <Button
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={() => setModalOpen(true)}
              >
                Delete
              </Button>
              <ConfirmationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDeleteButtonClick}
                title='Delete Supplier'
                body='Are you sure you want to delete this supplier?'
              />
            </div>
          </div>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          <Paper elevation={2}>
            <form>
              <FormGroup className='create-product-form'>
                <div className='top-content'>
                  <div className='product-text-fields'>
                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-required'
                        label='Supplier Name'
                        name='name'
                        value={editSupplier?.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldOnChange(e, 'name')
                        }
                        placeholder='eg.: Packaging Supplier 1'
                      />
                    ) : (
                      <Typography sx={{ padding: '15px' }}>
                        {`Supplier Name: ${editSupplier?.name}`}
                      </Typography>
                    )}

                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-required'
                        label='Email'
                        name='email'
                        value={editSupplier?.email}
                        error={
                          !validator.isEmail(editSupplier?.email) &&
                          !!editSupplier?.email
                        }
                        helperText={
                          !validator.isEmail(editSupplier?.email) &&
                          !!editSupplier?.email
                            ? 'Enter a valid email: example@email.com'
                            : ''
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldOnChange(e, 'email')
                        }
                        placeholder='eg.: john@gmail.com'
                      />
                    ) : (
                      <Typography sx={{ padding: '15px' }}>
                        {`Email: ${editSupplier?.email}`}
                      </Typography>
                    )}

                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-required'
                        label='Address'
                        name='address'
                        value={editSupplier?.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldOnChange(e, 'address')
                        }
                        placeholder='eg.: 123 Clementi Road, #01-01, Singapore 12345'
                      />
                    ) : (
                      <Typography sx={{ padding: '15px' }}>
                        {`Address: ${editSupplier?.address}`}
                      </Typography>
                    )}
                    {edit ? (
                      <Autocomplete
                        disablePortal
                        id='outline-required'
                        options={currencies}
                        value={editSupplier?.currency}
                        onChange={(event, newValue) => {
                          setEditSupplier({
                            ...editSupplier,
                            currency: newValue!
                          });
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label='Currency' required />
                        )}
                      />
                    ) : (
                      <Typography sx={{ padding: '15px' }}>
                        {`Currency: ${editSupplier?.currency}`}
                      </Typography>
                    )}
                  </div>
                </div>
                {/* product table */}
                {edit ? (
                  <SupplierProductEditGrid
                    currency={
                      editSupplier?.currency
                        ? editSupplier?.currency.split(' - ')[0]
                        : '-'
                    }
                    supplierProductList={supplierProducts}
                    updateSupplierProductList={(pdts) =>
                      setEditSupplier((prev) => ({
                        ...prev,
                        supplierProduct: pdts
                      }))
                    }
                  />
                ) : (
                  <DataGrid
                    columns={columns}
                    rows={supplierProducts}
                    getRowId={(row) => row.product.id}
                    loading={tableLoading}
                    autoHeight
                    pageSize={5}
                  />
                )}
              </FormGroup>
            </form>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default SupplierDetails;
