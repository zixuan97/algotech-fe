import React, { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { ChevronLeft, Delete } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { Product, ProductCatalogue } from 'src/models/types';
import '../../styles/pages/delivery/delivery.scss';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  updateProductCatalogue,
  deleteProductCatalogue,
  getAllProductCatalogues,
  getProductCatalogueById
} from '../../services/productCatalogueService';
import { isValidProductCatalogue } from 'src/components/catalogue/catalogueHelper';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import inventoryContext from 'src/context/inventory/inventoryContext';
import { getBase64 } from 'src/utils/fileUtils';
import { omit } from 'lodash';
import { useLocation } from 'react-router';
import ConfirmationModal from 'src/components/common/ConfirmationModal';

const CatalogueProductDetails = () => {
  const navigate = useNavigate();
  const imgRef = React.useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const current = useLocation();
  const currCatPdt = current.state as ProductCatalogue;

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [backdropLoading, setBackdropLoading] = React.useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = React.useState<Product>();

  const [originalCatalogueProduct, setOriginalCatalogueProduct] =
    React.useState<ProductCatalogue>(currCatPdt);
  const [editCatalogueProduct, setEditCatalogueProduct] =
    React.useState<ProductCatalogue>(currCatPdt);

  const [edit, setEdit] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(true);

  React.useEffect(() => {
    setDisableSave(!isValidProductCatalogue(editCatalogueProduct));
  }, [editCatalogueProduct]);

  React.useEffect(() => {
    if (id) {
      setLoading(true);
      asyncFetchCallback(
        getProductCatalogueById(id),
        (res) => {
          setOriginalCatalogueProduct(res);
          setEditCatalogueProduct(res);
          setSelectedProduct(res.product);
          setLoading(false);
        },
        () => {
          setAlert({
            severity: 'error',
            message:
              'Catalogue product does not exist. You will be redirected back to the Manage Product Catalogue page.'
          });
          setLoading(false);
          setTimeout(() => navigate('/catalogue/allCatalogueProducts'), 3500);
        }
      );
    }
  }, [id, navigate]);

  const handleEditCatalogueProduct = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNumber: boolean = false
  ) => {
    const value = isNumber ? parseInt(e.target.value) : e.target.value;
    setEditCatalogueProduct(
      (prev) => prev && { ...prev, [e.target.name]: value }
    );
  };

  const handleEditPrice = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    let numDecimals;

    if (value.toString().split('.').length === 1) {
      numDecimals = 0;
    } else {
      numDecimals = value.toString().split('.')[1].length;
    }

    if (numDecimals > 2) {
      value = parseFloat(value.toFixed(2));
    }

    setEditCatalogueProduct((prev) => ({
      ...prev,
      [e.target.name]: value
    }));
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
            setEditCatalogueProduct((prev) => {
              console.log(res);
              if (prev) {
                return { ...prev, image: res as string };
              } else {
                return prev;
              }
            }),
          (err) => console.log(err)
        );
        setEditCatalogueProduct((prev) => ({
          ...prev,
          file: e.target.files![0]
        }));
      }
    }
  };

  const handleSave = async () => {
    if (editCatalogueProduct) {
      console.log('edited: ', editCatalogueProduct);
      setLoading(true);
      let formData = new FormData();
      formData.append('file', editCatalogueProduct.file as File);
      formData.append('id', String(editCatalogueProduct.id));
      formData.append('price', String(editCatalogueProduct.price));
      formData.append('product', JSON.stringify(editCatalogueProduct.product));
      formData.append('description', String(editCatalogueProduct.description));
      await asyncFetchCallback(
        updateProductCatalogue(formData),
        () => {
          setLoading(false);
          setOriginalCatalogueProduct(editCatalogueProduct);
          setAlert({
            severity: 'success',
            message: 'Catalogue product edited successfully!'
          });
        },
        (err) => {
          setLoading(false);
          setEditCatalogueProduct(originalCatalogueProduct);
          const resData = err.response?.data as AxiosErrDataBody;
          setAlert({
            severity: 'error',
            message: `Error editing catalogue product: ${resData.message}`
          });
        }
      );
    }
  };

  const handleDeleteCatalogueProduct = async () => {
    setModalOpen(false);
    setBackdropLoading(true);
    if (originalCatalogueProduct) {
      setLoading(false);
      asyncFetchCallback(
        deleteProductCatalogue(originalCatalogueProduct.id),
        () => {
          setBackdropLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Catalogue product successfully deleted. You will be redirected back to the Manage Product Catalogue page now.'
          });
          setTimeout(() => navigate('/catalogue/allCatalogueProducts'), 3500);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setBackdropLoading(false);
          setAlert({
            severity: 'error',
            message: `Error deleting catalogue product: ${resData.message}`
          });
        }
      );
    }
  };

  const title = `${edit ? 'Edit' : ''} Catalogue Product Details`;

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
                    setEditCatalogueProduct(originalCatalogueProduct);
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
                onConfirm={handleDeleteCatalogueProduct}
                title='Delete Catalogue Product'
                body='Are you sure you want to delete this catalogue product?'
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
                        border: editCatalogueProduct?.image
                          ? ''
                          : '1px solid lightgray'
                      }}
                      className={
                        editCatalogueProduct?.image ? '' : 'container-center'
                      }
                    >
                      {editCatalogueProduct?.image ? (
                        <img
                          src={editCatalogueProduct.image}
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
                        {editCatalogueProduct?.image && (
                          <IconButton
                            onClick={() => {
                              // @ts-ignore
                              imgRef.current.value = null;
                              setEditCatalogueProduct((prev) => {
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
                      // <FormControl>
                      //   <InputLabel id='product-label' required>
                      //     Product SKU
                      //   </InputLabel>
                      //   <Select
                      //     required
                      //     labelId='product-label'
                      //     id='product'
                      //     value={editCatalogueProduct.product?.id}
                      //     onChange={handleEditPdt}
                      //     input={<OutlinedInput label='Product SKU' />}
                      //   >
                      //     {availableProducts.map((option) => (
                      //       <MenuItem key={option.id} value={option.id}>
                      //         {option.sku}
                      //       </MenuItem>
                      //     ))}
                      //   </Select>
                      // </FormControl>
                      <TextField
                        label='Product SKU'
                        name='productSKU'
                        defaultValue=' '
                        value={selectedProduct?.sku}
                        variant='filled'
                        disabled
                        fullWidth
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Product SKU: ${editCatalogueProduct?.product.sku}`}</Typography>
                    )}
                    {edit ? (
                      <TextField
                        label='Product Name'
                        name='productName'
                        defaultValue=' '
                        value={selectedProduct?.name}
                        variant='filled'
                        disabled
                        fullWidth
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Product Name: ${editCatalogueProduct?.product.name}`}</Typography>
                    )}
                    {edit ? (
                      <TextField
                        label='Product Brand'
                        name='productBrand'
                        defaultValue=' '
                        value={selectedProduct?.brand.name}
                        variant='filled'
                        disabled
                        fullWidth
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Product Brand: ${editCatalogueProduct?.product.brand.name}`}</Typography>
                    )}
                    {edit ? (
                      <TextField
                        required
                        id='price'
                        label='Price'
                        name='price'
                        placeholder='e.g. 10.50'
                        type='number'
                        onChange={handleEditPrice}
                        value={editCatalogueProduct?.price}
                        inputProps={{
                          inputMode: 'decimal',
                          min: '0',
                          step: '0.01'
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Price: ${editCatalogueProduct?.price.toFixed(
                        2
                      )}`}</Typography>
                    )}
                  </div>
                </div>
                {edit ? (
                  <TextField
                    fullWidth
                    label='Description'
                    name='description'
                    value={editCatalogueProduct?.description}
                    onChange={handleEditCatalogueProduct}
                    placeholder='eg.: Our best-selling flavour to date!'
                    multiline
                    rows={4}
                  />
                ) : editCatalogueProduct?.description ? (
                  <Typography
                    sx={{ padding: '15px' }}
                  >{`Description: ${editCatalogueProduct?.description}`}</Typography>
                ) : (
                  <Typography
                    sx={{ padding: '15px' }}
                  >{`Description: -`}</Typography>
                )}
              </FormGroup>
            </form>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default CatalogueProductDetails;
