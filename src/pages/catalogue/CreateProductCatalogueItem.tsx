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
import { getSalesOrderDetailsSvc } from 'src/services/salesService';
import authContext from 'src/context/auth/authContext';
import {
  createProductCatalogue,
  getAllProductCatalogues
} from '../../services/productCatalogueService';
import { getAllProducts } from 'src/services/productService';
import { isValidProductCatalogue } from 'src/components/catalogue/catalogueHelper';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import inventoryContext from 'src/context/inventory/inventoryContext';
import { getBase64 } from 'src/utils/fileUtils';
import { omit } from 'lodash';

const CreateProductCatalogueItem = () => {
  const navigate = useNavigate();
  const imgRef = React.useRef<HTMLInputElement | null>(null);

  const [disableCreate, setDisableCreate] = React.useState<boolean>(true);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { products } = React.useContext(inventoryContext);
  const availableProducts = products;

  const [newProductCatalogue, setNewProductCatalogue] = React.useState<
    Partial<ProductCatalogue>
  >({});

  React.useEffect(() => {
    setDisableCreate(!isValidProductCatalogue(newProductCatalogue));
  }, [newProductCatalogue]);

  const handleEditProductCatalogue = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNumber: boolean = false
  ) => {
    const value = isNumber ? parseInt(e.target.value) : e.target.value;
    setNewProductCatalogue((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleEditPdt = (e: SelectChangeEvent<number>) =>
    setNewProductCatalogue((prev) => ({
      ...prev,
      product: products.find((product) => product.id === e.target.value)
    }));

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
      setLoading(true);
      await asyncFetchCallback(
        createProductCatalogue(newProductCatalogue as ProductCatalogue),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message: 'Product catalogue item successfully created!'
          });
          setTimeout(() => navigate('/catalogue/AllProductCatalogue'), 3000);
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
            <h1>Create Product Catalogue Item</h1>
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
                      <InputLabel id='brand-label' required>
                        Product
                      </InputLabel>
                      <Select
                        required
                        labelId='brand-label'
                        id='brand'
                        value={newProductCatalogue.product?.id}
                        onChange={handleEditPdt}
                        input={<OutlinedInput label='Brand' />}
                      >
                        {availableProducts.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </FormGroup>
            </form>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default CreateProductCatalogueItem;
