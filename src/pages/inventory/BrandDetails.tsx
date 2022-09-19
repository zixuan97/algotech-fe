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
  CircularProgress
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { Brand, Product } from '../../models/types';
import ProductCellAction from '../../components/inventory/ProductCellAction';
import {
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandById
} from '../../services/brandService';
import { getProductById } from '../../services/productService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';

const columns: GridColDef[] = [
  {
    field: 'productName',
    headerName: 'Product Name',
    flex: 2
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

interface ProductDetails {
  id: number;
  productName: string;
}

const BrandDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const current = useLocation();
  const brand = current.state as Brand;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [tableLoading, setTableLoading] = React.useState<boolean>(false);
  const [backdropLoading, setBackdropLoading] = React.useState<boolean>(false);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [originalBrand, setOriginalBrand] = React.useState<Brand>(brand);
  const [editBrand, setEditBrand] = React.useState<Brand>(brand);
  const [productDetails, setProductDetails] = React.useState<ProductDetails[]>(
    []
  );

  const [edit, setEdit] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(true);

  React.useEffect(() => {
    id &&
      asyncFetchCallback(getBrandById(id), (brand: Brand) => {
        if (brand) {
          setOriginalBrand(brand);
          setLoading(false);
        } else {
          setAlert({
            severity: 'error',
            message:
              'Brand does not exist. You will be redirected back to the Manage Brands page.'
          });
          setLoading(false);
          setTimeout(() => navigate('/inventory/AllBrands'), 3500);
        }
      });
  }, [id, navigate]);

  React.useEffect(() => {
    const shouldDisable = !editBrand?.name;
    setDisableSave(shouldDisable);
  }, [editBrand?.name]);

  React.useEffect(() => {
    setTableLoading(true);
    if (id) {
      asyncFetchCallback(getBrandById(id), (res) => {
        setOriginalBrand(res);
        setEditBrand(res);
        setLoading(false);
      });
    }
  }, [id]);

  React.useEffect(() => {
    if (originalBrand) {
      Promise.all(
        originalBrand.product.map(async (qty) => {
          const product = await getProductById(qty.id);
          return {
            id: qty.id,
            productName: product.name
          };
        })
      ).then(
        (res) => {
          setTableLoading(false);
          setProductDetails(res);
        },
        () => setTableLoading(false)
      );
    }
  }, [originalBrand]);

  const handleDeleteBrand = async () => {
    setModalOpen(false);
    setBackdropLoading(true);
    if (originalBrand) {
      setLoading(false);
      asyncFetchCallback(
        deleteBrand(originalBrand.id),
        () => {
          setBackdropLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Brand successfully deleted. You will be redirected back to the Manage Brands page now.'
          });
          setTimeout(() => navigate('/inventory/allBrands'), 3500);
        },
        () => {
          setBackdropLoading(false);
          setAlert({
            severity: 'error',
            message: 'Error deleting brand! Try again later.'
          });
        }
      );
    }
  };

  const handleFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditBrand((brand: Brand) => {
      return {
        ...brand,
        [key]: event.target.value
      };
    });
  };

  const handleSave = async () => {
    if (editBrand) {
      setBackdropLoading(true);
      asyncFetchCallback(
        updateBrand(editBrand),
        () => {
          setAlert({
            severity: 'success',
            message: 'Brand successfully edited.'
          });
          setBackdropLoading(false);
          setEditBrand(editBrand);
          setOriginalBrand(editBrand);
        },
        () => {
          setAlert({
            severity: 'error',
            message: 'Error editing brand! Try again later.'
          });
          setBackdropLoading(false);
        }
      );
    }
  };

  const title = `${edit ? 'Edit' : ''} Brand Details`;

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
                    setEditBrand(originalBrand);
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
                onConfirm={handleDeleteBrand}
                title='Delete Brand'
                body='Are you sure you want to delete this brand?
              Note that deleting brands with associated products will cause the associated products to be deleted too.'
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
                        label='Brand Name'
                        name='name'
                        value={editBrand?.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldOnChange(e, 'name')
                        }
                        placeholder='eg.: Kettle Gourmet'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Brand Name: ${editBrand?.name}`}</Typography>
                    )}
                  </div>
                </div>
                {/* product table */}
                {!edit && (
                  <DataGrid
                    columns={columns}
                    rows={productDetails}
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

export default BrandDetails;
