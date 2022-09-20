import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Select,
  OutlinedInput,
  FormControl,
  InputLabel,
  Chip,
  SelectChangeEvent,
  CircularProgress,
  Backdrop,
  Toolbar
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft, Delete } from '@mui/icons-material';
import { Brand, Category, Product } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  deleteProduct,
  getAllProductCategories,
  getProductById,
  updateProduct
} from 'src/services/productService';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { getAllLocations, getLocationById } from 'src/services/locationService';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import { Location } from 'src/models/types';
import LocationGrid from 'src/components/inventory/LocationGrid';
import { randomId } from '@mui/x-data-grid-generator';
import { intersectionWith, omit } from 'lodash';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import validator from 'validator';
import { getBase64 } from 'src/utils/fileUtils';
import { getBrandById } from 'src/services/brandService';
import inventoryContext from 'src/context/inventory/inventoryContext';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Warehouse Location',
    flex: 2
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    flex: 1
  },
  {
    field: 'price',
    headerName: 'Price',
    flex: 1
  }
];

// i apologise in advance for the long winded code, was rushing it out LOL
const ProductDetails = () => {
  const navigate = useNavigate();
  const { locations, categories } = React.useContext(inventoryContext);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const imgRef = React.useRef<HTMLInputElement | null>(null);

  const [disableSave, setDisableSave] = React.useState<boolean>(true);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [originalProduct, setOriginalProduct] = React.useState<Product>();
  const [editProduct, setEditProduct] = React.useState<Product>();

  const [edit, setEdit] = React.useState<boolean>(false);

  React.useEffect(() => {
    id &&
      asyncFetchCallback(
        getProductById(id),
        (product: Product) => {
          console.log('hello world');
          setLoading(false);
        },
        () => {
          setAlert({
            severity: 'error',
            message:
              'Product does not exist. You will be redirected back to the All Products page.'
          });
          setLoading(false);
          setTimeout(() => navigate('/inventory/allProducts'), 3500);
        }
      );
  }, [id, navigate]);

  React.useEffect(() => {
    const shouldDisable = !(
      editProduct?.sku &&
      editProduct?.name &&
      editProduct?.brand &&
      editProduct?.qtyThreshold
    );
    setDisableSave(shouldDisable);
  }, [
    editProduct?.sku,
    editProduct?.name,
    editProduct?.brand,
    editProduct?.qtyThreshold
  ]);

  React.useEffect(() => {
    if (id) {
      setLoading(true);
      asyncFetchCallback(getProductById(id), (res) => {
        setOriginalProduct(res);
        setEditProduct(res);
        setLoading(false);
      });
    }
  }, [id]);

  const handleEditProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProduct((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleEditProductNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProduct((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: parseInt(e.target.value) };
      } else {
        return prev;
      }
    });
  };

  const handleEditCategories = (e: SelectChangeEvent<string[]>) => {
    const inputCategories = e.target.value;
    console.log(inputCategories);
    setEditProduct((prev) => {
      if (prev) {
        return {
          ...prev,
          categories: intersectionWith(
            categories,
            inputCategories,
            (a, b) => a.name === b
          )
        };
      } else {
        return prev;
      }
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // limit file size greater than 3mb
      if (e.target.files[0].size > 3145728) {
        setAlert({
          message: 'File size must be smaller than 3MB!',
          severity: 'warning'
        });
      } else {
        getBase64(
          e.target.files[0],
          (res) =>
            setEditProduct((prev) => {
              console.log(res);
              if (prev) {
                return { ...prev, image: res as string };
              } else {
                return prev;
              }
            }),
          (err) => console.log(err)
        );
      }
    }
  };

  const handleSave = async () => {
    if (editProduct) {
      setLoading(true);
      await asyncFetchCallback(
        updateProduct(editProduct),
        () => {
          setOriginalProduct(editProduct);
          setAlert({
            message: 'Product edited successfully',
            severity: 'success'
          });
          setLoading(false);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setAlert({
            message: `An error occured: ${resData.message}`,
            severity: 'error'
          });
          setEditProduct(originalProduct);
          setLoading(false);
        }
      );
    }
  };

  const handleDeleteProduct = async () => {
    setModalOpen(false);
    setLoading(true);
    if (originalProduct) {
      await asyncFetchCallback(
        deleteProduct(originalProduct.id!),
        (res) => {
          setLoading(false);
          setAlert({
            message: `Successfully deleted product with SKU: ${originalProduct.sku}`,
            severity: 'success'
          });
          setTimeout(() => navigate('/inventory/allProducts'), 3000);
        },
        () => setLoading(false)
      );
    }
  };

  const title = `${edit ? 'Edit' : ''} Product Details`;

  return (
    <div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
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
              {/* {loading && <CircularProgress color='secondary' />} */}
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
                {edit ? 'SAVE CHANGES' : 'EDIT'}
              </Button>
              {edit && (
                <Button
                  variant='contained'
                  className='create-btn'
                  color='primary'
                  onClick={() => {
                    setEdit(false);
                    setEditProduct(originalProduct);
                  }}
                >
                  DISCARD CHANGES
                </Button>
              )}
              <Button
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={() => setModalOpen(true)}
              >
                DELETE
              </Button>
              <ConfirmationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDeleteProduct}
                title='Delete Product'
                body='Are you sure you want to delete this product?'
              />
            </div>
          </div>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          <Paper elevation={2}>
            <form>
              <FormGroup className='create-product-form'>
                <div className='top-content'>
                  <div>
                    <Box
                      sx={{
                        width: 200,
                        maxWidth: 300,
                        height: 300,
                        maxHeight: 500,
                        border: editProduct?.image ? '' : '1px solid lightgray'
                      }}
                      className={editProduct?.image ? '' : 'container-center'}
                    >
                      {editProduct?.image ? (
                        <img
                          src={editProduct.image}
                          alt='Product'
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      ) : (
                        <Typography>Product Image</Typography>
                      )}
                    </Box>
                    {edit && (
                      <Toolbar>
                        <Button
                          variant='outlined'
                          component='label'
                          size='small'
                        >
                          Upload Image
                          <input
                            ref={imgRef}
                            hidden
                            accept='image/*'
                            type='file'
                            onChange={handleImage}
                          />
                        </Button>
                        {editProduct?.image && (
                          <IconButton
                            onClick={() => {
                              // @ts-ignore
                              imgRef.current.value = null;
                              setEditProduct((prev) => {
                                if (prev) {
                                  return omit(prev, ['image']);
                                }
                                return prev;
                              });
                            }}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Toolbar>
                    )}
                  </div>
                  <div className='product-text-fields'>
                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-required'
                        label='SKU'
                        name='sku'
                        value={editProduct?.sku}
                        error={validator.isEmpty(editProduct?.sku!)}
                        helperText={
                          validator.isEmpty(editProduct?.sku!)
                            ? 'SKU is empty!'
                            : ''
                        }
                        onChange={handleEditProduct}
                        placeholder='eg.: SKU12345678'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`SKU: ${originalProduct?.sku}`}</Typography>
                    )}
                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-required'
                        label='Product Name'
                        name='name'
                        value={editProduct?.name}
                        error={validator.isEmpty(editProduct?.name!)}
                        helperText={
                          validator.isEmpty(editProduct?.name!)
                            ? 'Product Name is empty!'
                            : ''
                        }
                        onChange={handleEditProduct}
                        placeholder='eg.: Nasi Lemak Popcorn'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Name: ${originalProduct?.name}`}</Typography>
                    )}
                    {edit ? (
                      <FormControl>
                        <InputLabel id='productCategories-label'>
                          Categories
                        </InputLabel>
                        <Select
                          labelId='productCategories-label'
                          id='ProductCategories'
                          multiple
                          value={
                            editProduct?.categories.map((cat) => cat.name) ?? []
                          }
                          onChange={handleEditCategories}
                          input={<OutlinedInput label='Categories' />}
                        >
                          {categories.map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      originalProduct && (
                        <div className='horizontal-inline-bar'>
                          <Typography sx={{ padding: '15px' }}>
                            Categories:
                          </Typography>
                          {originalProduct.categories.map((category) => (
                            <Chip
                              key={category.name}
                              label={
                                <Typography sx={{ fontSize: 'inherit' }}>
                                  {category.name}
                                </Typography>
                              }
                              color='secondary'
                            />
                          ))}
                        </div>
                      )
                    )}
                    {editProduct?.brand && (
                      <Typography sx={{ padding: '15px' }}>
                        {`Brand: ${editProduct?.brand.name}`}
                      </Typography>
                    )}
                    {edit ? (
                      <TextField
                        required
                        id='outlined-required'
                        label='Quantity Threshold'
                        name='qtyThreshold'
                        placeholder='e.g. 10'
                        error={
                          editProduct?.qtyThreshold! < 0 ||
                          !editProduct?.qtyThreshold
                        }
                        helperText={
                          editProduct?.qtyThreshold! < 0 ||
                          !editProduct?.qtyThreshold
                            ? 'Quantity Threshold is wrong!'
                            : ''
                        }
                        onChange={handleEditProductNumber}
                        value={editProduct?.qtyThreshold}
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Quantity Threshold for Low Stock: ${originalProduct?.qtyThreshold}`}</Typography>
                    )}
                  </div>
                </div>
                {edit ? null : ( //   /> //     updateProductLocations={setProductLocations} //     productLocations={productLocations} //     locations={locations} //   <LocationGrid
                  <DataGrid
                    columns={columns}
                    rows={originalProduct?.stockQuantity ?? []}
                    getRowId={(row) => row.name}
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

export default ProductDetails;
