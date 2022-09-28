import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Backdrop,
  Box,
  FormGroup,
  TextField,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { Bundle, Product, BundleProduct } from '../../models/types';
import ProductCellAction from '../../components/inventory/ProductCellAction';
import {
  getBundleById,
  updateBundle,
  deleteBundle
} from '../../services/bundleService';
import { getAllProductsByBundle } from '../../services/productService';
import BundleProductEditGrid from 'src/components/inventory/BundleProductEditGrid';
import { 
  DataGrid, 
  GridColDef, 
  GridValueGetterParams 
} from '@mui/x-data-grid';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
 } from 'src/components/common/TimeoutAlert';
import { isValidBundle } from 'src/components/inventory/inventoryHelper';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Product Name',
    flex: 2,
    valueGetter: (params: GridValueGetterParams) => params.row.product.name
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    flex: 1,
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

const BundleDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const current = useLocation();
  const bundle = current.state as Bundle;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [tableLoading, setTableLoading] = React.useState<boolean>(false);
  const [backdropLoading, setBackdropLoading] = React.useState<boolean>(false);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [originalBundle, setOriginalBundle] =
    React.useState<Bundle>(bundle);
  const [editBundle, setEditBundle] = React.useState<Bundle>(bundle);
  const [productDetails, setProductDetails] = React.useState<BundleProduct[]>(
    []
  );

  const [edit, setEdit] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(true);

  React.useEffect(() => {
    id &&
      asyncFetchCallback(getBundleById(id), (bundle: Bundle) => {
        if (bundle) {
          setOriginalBundle(bundle);
          setEditBundle(bundle);
          setLoading(false);
        } else {
          setAlert({
            severity: 'error',
            message:
              'Bundle does not exist. You will be redirected back to the All Bundles page.'
          });
          setLoading(false);
          setTimeout(() => navigate('/inventory/allBundles'), 3500);
        }
      });
  }, [id, navigate]);

  React.useEffect(() => {
    setDisableSave(!isValidBundle(editBundle));
  }, [editBundle]);

  React.useEffect(() => {
    setTableLoading(true);
    if (id) {
      asyncFetchCallback(getBundleById(id), (res) => {
        setOriginalBundle(res);
        setEditBundle(res);

        setProductDetails(res.bundleProduct);
        setTableLoading(false);

        setLoading(false);
      });
    }
  }, [id]);

  React.useEffect(() => {
    setTableLoading(true);
    if (id) {
      asyncFetchCallback(getBundleById(id), (res) => {
        setProductDetails(res.bundleProduct);
        setTableLoading(false);
      });
    }
  }, [id, editBundle, originalBundle]);

  const handleDeleteButtonClick = () => {
    setModalOpen(false);
    setBackdropLoading(true);
    if (originalBundle) {
      asyncFetchCallback(
        deleteBundle(originalBundle.id),
        () => {
          setBackdropLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Bundle successfully deleted. You will be redirected to the All Bundles page now.'
          });
          setTimeout(() => navigate('/inventory/allBundles'), 3500);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setBackdropLoading(false);
          setAlert({
            severity: 'error',
            message: `Error deleting bundle: ${resData.message}`
          });
        }
      );
    }
  };

  const handleFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditBundle((bundle: Bundle) => {
      return {
        ...bundle,
        [key]: event.target.value
      };
    });
  };

  const handleSave = async () => {
    if (editBundle) {
      setBackdropLoading(true);
      asyncFetchCallback(
        updateBundle(editBundle),
        () => {
          setAlert({
            severity: 'success',
            message: 'Bundle successfully edited.'
          });
          setBackdropLoading(false);
          setEditBundle(editBundle);
          setOriginalBundle(editBundle);

        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setBackdropLoading(false);
          setAlert({
            severity: 'error',
            message: `Error editing bundle: ${resData.message}`
          });
        }
      );
    }
  };

  const title = `${edit ? 'Edit' : ''} Bundle Details`;

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
                    setEditBundle(originalBundle);
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
                title='Delete Bundle'
                body='Are you sure you want to delete this bundle?'
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
                        label='Bundle Name'
                        name='name'
                        value={editBundle?.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldOnChange(e, 'name')
                        }
                        placeholder='eg.: Festive Favourites'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Bundle Name: ${editBundle?.name}`}</Typography>
                    )}

                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-required'
                        label='Description'
                        name='description'
                        value={editBundle?.description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldOnChange(e, 'description')
                        }
                        placeholder='eg.: For Christmas period'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Description: ${editBundle?.description}`}</Typography>
                    )}

                  </div>
                </div>
                {/* product table */}
                {edit ? (
                  <BundleProductEditGrid
                    bundleProductList={productDetails}
                    updateBundleProductList={(pdts) =>
                      setEditBundle((prev) => ({
                        ...prev,
                        bundleProduct: pdts
                      }))
                    }
                  />
                ) : (
                  <DataGrid
                    columns={columns}
                    rows={productDetails}
                    getRowId={(row) => row.productId}
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

export default BundleDetails;
