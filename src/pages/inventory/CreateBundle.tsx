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
  CircularProgress,
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { Bundle, Product, BundleProduct } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { createBundle } from 'src/services/bundleService';
import BundleProductEditGrid from 'src/components/inventory/BundleProductEditGrid';
import {
  AlertType,
  AxiosErrDataBody
} from '../../components/common/TimeoutAlert';
import { isValidBundle } from 'src/components/inventory/inventoryHelper';
import { useSearchParams } from 'react-router-dom';

export type NewBundle = Partial<Bundle> & {};
type NewBundleProduct = Partial<BundleProduct>;

const CreateBundle = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [disableCreate, setDisableCreate] = React.useState<boolean>(true);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [newBundle, setNewBundle] = React.useState<NewBundle>({
    bundleProduct: []
  });

  // const [bundleProductDetails, setBundleProductDetails] = React.useState<BundleProduct[]>([]);
  // const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  // const [tableLoading, setTableLoading] = React.useState<boolean>(false);
  // const [addedProductsId, setAddedProductsId] = React.useState<number[]>([]);


  React.useEffect(() => {
    setDisableCreate(!isValidBundle(newBundle));

    if (newBundle.bundleProduct) {
      newBundle.bundleProduct?.forEach((bundlePdt) => {
        if (bundlePdt.quantity.toString() === "0") {
          setDisableCreate(true);
        }
      });
    }

  }, [newBundle]);

  const handleEditBundle = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNumber: boolean = false
  ) => {
    const value = isNumber ? parseInt(e.target.value) : e.target.value;
    setNewBundle((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (newBundle) {
      setLoading(true);
      await asyncFetchCallback(
        createBundle(newBundle as Bundle),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message: 'Bundle successfully created! You will be redirected back to the All Bundles page now.'
          });
          setTimeout(() => navigate('/inventory/allBundles'), 3000);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating bundle: ${resData.message}`
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
            <h1>Create Bundle</h1>
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
                      label='Bundle Name'
                      name='name'
                      value={newBundle?.name}
                      onChange={handleEditBundle}
                      placeholder='eg.: Festive Favourites'
                    />

                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Description'
                      name='description'
                      value={newBundle?.description}
                      onChange={handleEditBundle}
                      placeholder='eg.: For Christmas period'
                    />
                  </div>
                </div>
                <BundleProductEditGrid
                  bundleProductList={newBundle.bundleProduct ?? []}
                  updateBundleProductList={(pdts) =>
                    setNewBundle((prev) => ({
                      ...prev,
                      bundleProduct: pdts
                    }))
                  }
                />
                  {/* {(
                    <Button
                    variant='contained'
                    size='medium'
                    sx={{ height: 'fit-content' }}
                    onClick={() => setModalOpen(true)}
                    >
                      Add Products to Bundle
                    </Button>
                  )}
                  <BundleProductModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onConfirm={handleAddBundleProducts}
                    title='Add Products to Bundle'
                    addedProductsId={addedProductsId}
                  /> */}
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() => navigate('/inventory/allBundles')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    className='create-btn'
                    color='primary'
                    disabled={disableCreate}
                  >
                    Create Bundle
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

export default CreateBundle;