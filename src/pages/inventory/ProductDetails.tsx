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
  CircularProgress
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import { Category, Product, ProductCategory } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  deleteProduct,
  getAllProductCategories,
  getProductById,
  updateProduct
} from 'src/services/productService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getLocationById } from 'src/services/locationService';
import { intersectionWith } from 'lodash';
import ConfirmationModal from 'src/components/common/ConfirmationModal';

const columns: GridColDef[] = [
  {
    field: 'locationName',
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

interface LocationDetails {
  locationName: string;
  quantity: number;
  price: number;
}

// i apologise in advance for the long winded code, was rushing it out LOL
const ProductDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = React.useState<boolean>(true);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [originalProduct, setOriginalProduct] = React.useState<Product>();
  const [editProduct, setEditProduct] = React.useState<Product>();
  const [locationDetails, setLocationDetails] = React.useState<
    LocationDetails[]
  >([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [edit, setEdit] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (id) {
      asyncFetchCallback(getProductById(id), (res) => {
        setOriginalProduct(res);
        setEditProduct(res);
        setLoading(false);
      });
    }
  }, [id]);

  React.useEffect(() => {
    if (originalProduct) {
      Promise.all(
        originalProduct.stockQuantity.map(async (qty) => {
          const location = await getLocationById(qty.location_id);
          return {
            locationName: location.name,
            quantity: qty.quantity,
            price: qty.price
          };
        })
      ).then((res) => setLocationDetails(res));
    }
  }, [originalProduct]);

  React.useEffect(() => {
    asyncFetchCallback(getAllProductCategories(), setCategories);
  }, []);

  console.log(editProduct);

  const handleEditProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProduct((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleEditCategories = (e: SelectChangeEvent<string[]>) => {
    const inputCategories = e.target.value;
    setEditProduct((prev) => {
      if (prev) {
        return {
          ...prev,
          productCategory: intersectionWith(
            categories,
            inputCategories,
            (a, b) => a.name === b
          ).map((cat) => {
            return {
              product_sku: editProduct?.sku,
              category_id: cat.id,
              category_name: cat.name,
              category: cat,
              product: editProduct
            } as ProductCategory;
          })
        };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    if (editProduct) {
      await asyncFetchCallback(updateProduct(editProduct), (res) => {
        setLoading(false);
      });
    }
  };

  const handleDeleteProduct = async () => {
    setLoading(true);
    if (originalProduct) {
      await asyncFetchCallback(
        deleteProduct(originalProduct.id),
        (res) => {
          setLoading(false);
          // TODO: print out success
          navigate({ pathname: '/inventory/allProducts' });
        },
        () => setLoading(false)
      );
    }
  };

  const title = `${edit ? 'Edit' : ''} Product Details`;

  return (
    <div>
      <Tooltip title='Return to Previous Page' enterDelay={300}>
        <IconButton
          size='large'
          onClick={() => navigate(-1)}
        >
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
          <Paper elevation={2}>
            <form>
              <FormGroup className='create-product-form'>
                <div className='top-content'>
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      backgroundColor: 'primary.dark',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        opacity: [0.9, 0.8, 0.7]
                      }
                    }}
                  />
                  <div className='text-fields'>
                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-required'
                        label='SKU'
                        name='sku'
                        value={editProduct?.sku}
                        onChange={handleEditProduct}
                        placeholder='eg.: SKU12345678'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`SKU: ${editProduct?.sku}`}</Typography>
                    )}
                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-required'
                        label='Product Name'
                        name='name'
                        value={editProduct?.name}
                        onChange={handleEditProduct}
                        placeholder='eg.: Nasi Lemak Popcorn'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Name: ${editProduct?.name}`}</Typography>
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
                            editProduct?.productCategory.map(
                              (cat) => cat.category_name
                            ) ?? []
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
                      editProduct && (
                        <div className='horizontal-inline-bar'>
                          <Typography sx={{ padding: '15px' }}>
                            Categories:
                          </Typography>
                          {editProduct.productCategory.map((category) => (
                            <Chip
                              key={category.category_name}
                              label={
                                <Typography sx={{ fontSize: 'inherit' }}>
                                  {category.category_name}
                                </Typography>
                              }
                              color='secondary'
                            />
                          ))}
                        </div>
                      )
                    )}
                    {edit ? (
                      <TextField
                        required
                        id='outlined-required'
                        label='Quantity Threshold'
                        name='qtyThreshold'
                        placeholder='e.g. 10'
                        onChange={handleEditProduct}
                        value={editProduct?.qtyThreshold}
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Quantity Threshold for Low Stock: ${editProduct?.qtyThreshold}`}</Typography>
                    )}
                  </div>
                </div>
                <DataGrid
                  columns={columns}
                  rows={locationDetails}
                  getRowId={(row) => row.locationName}
                  autoHeight
                  pageSize={5}
                />
              </FormGroup>
            </form>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default ProductDetails;
