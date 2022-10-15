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
  IconButton,
  InputLabel,
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
import { Product, ProductCatalogue } from 'src/models/types';
import '../../styles/pages/delivery/delivery.scss';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  createProductCatalogue,
  getAllProductCatalogues
} from '../../services/productCatalogueService';
import { isValidProductCatalogue } from 'src/components/catalogue/catalogueHelper';
import {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import { getBase64 } from 'src/utils/fileUtils';
import { omit } from 'lodash';
import { getAllProducts } from 'src/services/productService';

const CreateCatalogueProduct = () => {
  const navigate = useNavigate();
  const imgRef = React.useRef<HTMLInputElement | null>(null);

  const [disableCreate, setDisableCreate] = React.useState<boolean>(true);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newProductCatalogue, setNewProductCatalogue] = React.useState<
    Partial<ProductCatalogue>
  >({});
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = React.useState<Product[]>(
    []
  );
  const [unavailProductIds, setUnavailProductIds] = React.useState<number[]>(
    []
  );

  const [selectedProduct, setSelectedProduct] = React.useState<Product>();

  React.useEffect(() => {
    asyncFetchCallback(getAllProductCatalogues(), (res) => {
      res.forEach((pc) => {
        unavailProductIds?.push(pc.productId);
        setUnavailProductIds(unavailProductIds);
      });
    });
    console.log('unavailProdIds', unavailProductIds);

    asyncFetchCallback(getAllProducts(), (res) => {
      setAllProducts(res);
      console.log('allProd', allProducts);
      setAvailableProducts(
        res.filter((pdt) => !unavailProductIds.includes(pdt.id))
      );
      console.log('availProd', availableProducts);
    });
  }, [unavailProductIds]);

  React.useEffect(() => {
    setDisableCreate(!isValidProductCatalogue(newProductCatalogue));
  }, [newProductCatalogue]);

  const handleEditCatalogueProduct = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNumber: boolean = false
  ) => {
    const value = isNumber ? parseInt(e.target.value) : e.target.value;
    setNewProductCatalogue((prev) => ({ ...prev, [e.target.name]: value }));
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

    setNewProductCatalogue((prev) => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleEditPdt = (e: SelectChangeEvent<number>) => {
    const pdt = allProducts.find((product) => product.id === e.target.value);
    setNewProductCatalogue((prev) => ({
      ...prev,
      product: pdt
    }));
    setSelectedProduct(pdt!);
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
            setNewProductCatalogue((prev) => {
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

    if (newProductCatalogue) {
      console.log('newProductCatalogue: ', newProductCatalogue);
      setLoading(true);
      await asyncFetchCallback(
        createProductCatalogue(newProductCatalogue as ProductCatalogue),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message: 'Product catalogue item successfully created!'
          });
          setTimeout(() => navigate('/catalogue/allCatalogueProducts'), 3000);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating product catalogue item: ${resData.message}`
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
            <h1>Create Catalogue Product</h1>
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
                        border: newProductCatalogue.image
                          ? ''
                          : '1px solid lightgray'
                      }}
                      className={
                        newProductCatalogue.image ? '' : 'container-center'
                      }
                    >
                      {newProductCatalogue.image ? (
                        <img
                          src={newProductCatalogue.image}
                          alt='Product Catalogue Item'
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
                      {newProductCatalogue.image && (
                        <IconButton
                          onClick={() => {
                            // @ts-ignore
                            imgRef.current.value = null;
                            setNewProductCatalogue((prev) => {
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
                    <FormControl>
                      <InputLabel id='product-label' required>
                        Product SKU
                      </InputLabel>
                      <Select
                        required
                        labelId='product-label'
                        id='product'
                        value={newProductCatalogue.product?.id}
                        onChange={handleEditPdt}
                        input={<OutlinedInput label='Product SKU' />}
                      >
                        {availableProducts.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.sku}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label='Product Name'
                      name='productName'
                      defaultValue=' '
                      value={selectedProduct?.name}
                      variant='filled'
                      disabled
                      fullWidth
                    />
                    <TextField
                      label='Product Brand'
                      name='productBrand'
                      defaultValue=' '
                      value={selectedProduct?.brand.name}
                      variant='filled'
                      disabled
                      fullWidth
                    />
                    <TextField
                      required
                      id='price'
                      label='Price'
                      name='price'
                      placeholder='e.g. 10.50'
                      type='number'
                      onChange={handleEditPrice}
                      value={newProductCatalogue?.price}
                      inputProps={{
                        inputMode: 'decimal',
                        min: '0',
                        step: '0.01'
                      }}
                    />
                  </div>
                </div>
                <TextField
                  fullWidth
                  label='Description'
                  name='description'
                  value={newProductCatalogue?.description}
                  onChange={handleEditCatalogueProduct}
                  placeholder='eg.: Our best-selling flavour to date!'
                  multiline
                  rows={4}
                />
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() => navigate('/catalogue/allCatalogueProducts')}
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
                    Create Catalogue Product
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

export default CreateCatalogueProduct;
