import React, { FormEvent } from 'react';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  MenuItem,
  Button,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  SelectChangeEvent,
  Toolbar,
  Alert,
  Backdrop,
  CircularProgress,
  Typography
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft, Delete } from '@mui/icons-material';
import { GridRowId } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { Category, Product, Brand, Location } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  createProduct,
  getAllProductCategories
} from 'src/services/productService';
import { has, intersectionWith, omit } from 'lodash';
import { getAllBrands } from 'src/services/brandService';
import { getBase64 } from 'src/utils/fileUtils';
import { getAllLocations } from 'src/services/locationService';
import LocationGrid from 'src/components/inventory/LocationGrid';
import { randomId } from '@mui/x-data-grid-generator';
import {
  AlertType,
  AxiosErrDataBody
} from '../../components/common/TimeoutAlert';
import inventoryContext from '../../context/inventory/inventoryContext';
import { isValidProduct } from 'src/components/inventory/inventoryHelper';

export interface ProductLocation {
  id: number;
  name: string;
  price: number;
  quantity: number;
  isNew?: boolean;
}

export interface ProductLocationRow extends ProductLocation {
  gridId: GridRowId;
}

// TODO: this page needs major refactoring
const CreateProduct = () => {
  const navigate = useNavigate();
  const { brands, categories, locations } = React.useContext(inventoryContext);

  const imgRef = React.useRef<HTMLInputElement | null>(null);

  const [disableCreate, setDisableCreate] = React.useState<boolean>(true);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newProduct, setNewProduct] = React.useState<Partial<Product>>({
    categories: [],
    stockQuantity: []
  });

  React.useEffect(() => {
    setDisableCreate(isValidProduct(newProduct));
  }, [newProduct]);

  const handleEditProductString = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleEditCategories = (e: SelectChangeEvent<string[]>) => {
    const inputCategories = e.target.value;
    setNewProduct((prev) => {
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

  const handleEditBrand = (e: SelectChangeEvent<number>) => {
    setNewProduct((prev) => {
      if (prev) {
        return { ...prev, brand_id: e.target.value as number };
      } else {
        return prev;
      }
    });
  };

  const handleEditProductNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: parseInt(e.target.value) };
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
            setNewProduct((prev) => {
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

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (newProduct) {
      setLoading(true);
      await asyncFetchCallback(
        createProduct(newProduct as Product),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message: 'Product successfully created!'
          });
          setTimeout(() => navigate('/inventory/allProducts'), 3000);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating product: ${resData.message}`
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
            <h1>Create Product</h1>
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
                  <div>
                    <Box
                      sx={{
                        width: 200,
                        maxWidth: 300,
                        height: 300,
                        maxHeight: 500,
                        border: newProduct.image ? '' : '1px solid lightgray'
                      }}
                      className={newProduct.image ? '' : 'container-center'}
                    >
                      {newProduct.image ? (
                        <img
                          src={newProduct.image}
                          alt='Product'
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      ) : (
                        <Typography>Product Image</Typography>
                      )}
                    </Box>
                    <Toolbar>
                      <Button variant='outlined' component='label' size='small'>
                        Upload Image
                        <input
                          ref={imgRef}
                          hidden
                          accept='image/*'
                          type='file'
                          onChange={handleImage}
                        />
                      </Button>
                      {newProduct.image && (
                        <IconButton
                          onClick={() => {
                            // @ts-ignore
                            imgRef.current.value = null;
                            setNewProduct((prev) => {
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
                  </div>
                  <div className='product-text-fields'>
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='SKU'
                      name='sku'
                      value={newProduct?.sku}
                      onChange={handleEditProductString}
                      placeholder='eg.: SKU12345678'
                    />

                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Product Name'
                      name='name'
                      value={newProduct?.name}
                      onChange={handleEditProductString}
                      placeholder='eg.: Nasi Lemak Popcorn'
                    />
                    <FormControl>
                      <InputLabel id='productCategories-label'>
                        Categories
                      </InputLabel>
                      <Select
                        labelId='productCategories-label'
                        id='ProductCategories'
                        multiple
                        value={
                          newProduct?.categories?.map((cat) => cat.name) ?? []
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
                    <FormControl>
                      <InputLabel id='brand-label' required>
                        Brand
                      </InputLabel>
                      <Select
                        required
                        labelId='brand-label'
                        id='brand'
                        value={newProduct.brand?.id}
                        onChange={handleEditBrand}
                        input={<OutlinedInput label='Brand' />}
                      >
                        {brands.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      required
                      id='outlined-required'
                      label='Quantity Threshold'
                      name='qtyThreshold'
                      placeholder='e.g. 10'
                      type='number'
                      onChange={handleEditProductNumber}
                      value={newProduct?.qtyThreshold}
                    />
                  </div>
                </div>
                {/* <LocationGrid
                  locations={locations}
                  productLocations={productLocations}
                  updateProductLocations={setProductLocations}
                /> */}
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() => navigate('/inventory/allProducts')}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    className='create-btn'
                    color='primary'
                    disabled={disableCreate}
                  >
                    CREATE PRODUCT
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

export default CreateProduct;
