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
import { Bundle, BundleCatalogue } from 'src/models/types';
import '../../styles/pages/delivery/delivery.scss';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  createBundleCatalogue,
  getAllBundleCatalogues
} from '../../services/bundleCatalogueService';
import { isValidBundleCatalogue } from 'src/components/catalogue/catalogueHelper';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import inventoryContext from 'src/context/inventory/inventoryContext';
import { getBase64 } from 'src/utils/fileUtils';
import { omit } from 'lodash';
import { getAllBundles } from 'src/services/bundleService';

const CreateCatalogueBundle = () => {
  const navigate = useNavigate();
  const imgRef = React.useRef<HTMLInputElement | null>(null);

  const [disableCreate, setDisableCreate] = React.useState<boolean>(true);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newBundleCatalogue, setNewBundleCatalogue] = React.useState<
    Partial<BundleCatalogue>
  >({});
  const [allBundles, setAllBundles] = React.useState<Bundle[]>([]);
  const [availableBundles, setAvailableBundles] = React.useState<Bundle[]>([]);
  const [unavailBundleIds, setUnavailBundleIds] = React.useState<number[]>([]);

  const [selectedBundle, setSelectedBundle] = React.useState<Bundle>();

  React.useEffect(() => {
    asyncFetchCallback(getAllBundleCatalogues(), (res) => {
      res.forEach((bc) => {
        unavailBundleIds?.push(bc.bundleId);
        setUnavailBundleIds(unavailBundleIds);
      });
    });
    console.log('unavailBunIds', unavailBundleIds);

    asyncFetchCallback(getAllBundles(), (res) => {
      setAllBundles(res);
      console.log('allBun', allBundles);
      setAvailableBundles(
        res.filter((bun) => !unavailBundleIds.includes(bun.id))
      );
      console.log('availBun', availableBundles);
    });
  }, [unavailBundleIds]);

  React.useEffect(() => {
    setDisableCreate(!isValidBundleCatalogue(newBundleCatalogue));
  }, [newBundleCatalogue]);

  const handleEditCatalogueBundle = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNumber: boolean = false
  ) => {
    const value = isNumber ? parseInt(e.target.value) : e.target.value;
    setNewBundleCatalogue((prev) => ({ ...prev, [e.target.name]: value }));
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

    setNewBundleCatalogue((prev) => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleEditBundle = (e: SelectChangeEvent<number>) => {
    const bun = allBundles.find((bundle) => bundle.id === e.target.value);
    setNewBundleCatalogue((prev) => ({
      ...prev,
      bundle: bun
    }));
    setSelectedBundle(bun!);
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
            setNewBundleCatalogue((prev) => {
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

    if (newBundleCatalogue) {
      console.log('newBundleCatalogue: ', newBundleCatalogue);
      setLoading(true);
      await asyncFetchCallback(
        createBundleCatalogue(newBundleCatalogue as BundleCatalogue),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message: 'Bundle catalogue item successfully created!'
          });
          setTimeout(() => navigate('/catalogue/allCatalogueBundles'), 3000);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating bundle catalogue item: ${resData.message}`
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
            <h1>Create Catalogue Bundle</h1>
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
                        border: newBundleCatalogue.image
                          ? ''
                          : '1px solid lightgray'
                      }}
                      className={
                        newBundleCatalogue.image ? '' : 'container-center'
                      }
                    >
                      {newBundleCatalogue.image ? (
                        <img
                          src={newBundleCatalogue.image}
                          alt='Bundle Catalogue Item'
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      ) : (
                        <Typography>Bundle Image</Typography>
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
                      {newBundleCatalogue.image && (
                        <IconButton
                          onClick={() => {
                            // @ts-ignore
                            imgRef.current.value = null;
                            setNewBundleCatalogue((prev) => {
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
                      <InputLabel id='bundle-label' required>
                        Bundle Name
                      </InputLabel>
                      <Select
                        required
                        labelId='bundle-label'
                        id='bundle'
                        value={newBundleCatalogue.bundle?.id}
                        onChange={handleEditBundle}
                        input={<OutlinedInput label='Bundle Name' />}
                      >
                        {availableBundles.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label='Bundle Products'
                      name='bundleProducts'
                      defaultValue=' '
                      value={
                        selectedBundle?.bundleProduct
                          .map((bp) => bp.product.name)
                          .join(',\n') ?? []
                      }
                      variant='filled'
                      disabled
                      fullWidth
                      multiline
                      rows={5}
                    />
                    <TextField
                      required
                      id='price'
                      label='Price'
                      name='price'
                      placeholder='e.g. 10.50'
                      type='number'
                      onChange={handleEditPrice}
                      value={newBundleCatalogue?.price}
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
                  value={newBundleCatalogue?.description}
                  onChange={handleEditCatalogueBundle}
                  placeholder='eg.: Our best-selling set to date!'
                  multiline
                  rows={4}
                />
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() => navigate('/catalogue/allCatalogueBundles')}
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
                    Create Catalogue Bundle
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

export default CreateCatalogueBundle;
