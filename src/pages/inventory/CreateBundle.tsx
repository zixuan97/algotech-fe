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
import { Bundle, Product } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { createBundle } from 'src/services/bundleService';
import { intersectionWith, omit } from 'lodash';
import { getBase64 } from 'src/utils/fileUtils';
import ProductGrid from 'src/components/inventory/ProductGrid';
import {
  AlertType,
  AxiosErrDataBody
} from '../../components/common/TimeoutAlert';
import inventoryContext from '../../context/inventory/inventoryContext';
import { isValidProduct } from 'src/components/inventory/inventoryHelper';

export interface BundleProduct {
  id: number;
  isNew?: boolean;
}

export interface BundleProductRow extends BundleProduct {
  gridId: GridRowId;
}

const CreateBundle = () => {
  const navigate = useNavigate();
  const { products } = React.useContext(inventoryContext);

  const [disableCreate, setDisableCreate] = React.useState<boolean>(true);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newBundle, setNewBundle] = React.useState<Partial<Bundle>>({
    products: []
  });

  React.useEffect(() => {
    setDisableCreate(!isValidProduct(newBundle));
  }, [newBundle]);

  const handleEditBundle = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNumber: boolean = false
  ) => {
    const value = isNumber ? parseInt(e.target.value) : e.target.value;
    setNewBundle((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleEditCategories = (e: SelectChangeEvent<string[]>) => {
    const inputProducts = e.target.value;
    setNewBundle((prev) => {
      if (prev) {
        return {
          ...prev,
          products: intersectionWith(
            products,
            inputProducts,
            (a, b) => a.name === b
          )
        };
      } else {
        return prev;
      }
    });
  };

  // const handleEditBrand = (e: SelectChangeEvent<number>) =>
  //   setNewBundle((prev) => ({
  //     ...prev,
  //     brand: brands.find((brand) => brand.id === e.target.value)
  //   }));

  // const handleEditProductNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewBundle((prev) => {
  //     if (prev) {
  //       return { ...prev, [e.target.name]: parseInt(e.target.value) };
  //     } else {
  //       return prev;
  //     }
  //   });
  // };

  // const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     // limit file size greater than 3mb
  //     if (e.target.files[0].size > 3145728) {
  //       setAlert({
  //         message: 'File size must be smaller than 3MB!',
  //         severity: 'warning'
  //       });
  //     } else {
  //       getBase64(
  //         e.target.files[0],
  //         (res) =>
  //           setNewBundle((prev) => {
  //             console.log(res);
  //             if (prev) {
  //               return { ...prev, image: res as string };
  //             } else {
  //               return prev;
  //             }
  //           }),
  //         (err) => console.log(err)
  //       );
  //     }
  //   }
  // };

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
            message: 'Bundle successfully created!'
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
                <ProductGrid
                  product={newBundle.products ?? []}
                  updateProduct={(pdt) =>
                    setNewBundle((prev) => ({
                      ...prev,
                      products: pdt
                    }))
                  }
                />
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
                    CREATE BUNDLE
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