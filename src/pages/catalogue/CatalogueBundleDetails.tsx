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
  updateBundleCatalogue,
  deleteBundleCatalogue,
  getAllBundleCatalogues,
  getBundleCatalogueById
} from '../../services/bundleCatalogueService';
import { isValidBundleCatalogue } from 'src/components/catalogue/catalogueHelper';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import inventoryContext from 'src/context/inventory/inventoryContext';
import { getBase64 } from 'src/utils/fileUtils';
import { omit } from 'lodash';
import { useLocation } from 'react-router';
import ConfirmationModal from 'src/components/common/ConfirmationModal';

const CatalogueBundleDetails = () => {
  const navigate = useNavigate();
  const imgRef = React.useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const current = useLocation();
  const currCatBun = current.state as BundleCatalogue;

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [backdropLoading, setBackdropLoading] = React.useState<boolean>(false);

  const [selectedBundle, setSelectedBundle] = React.useState<Bundle>();

  const [originalCatalogueBundle, setOriginalCatalogueBundle] =
    React.useState<BundleCatalogue>(currCatBun);
  const [editCatalogueBundle, setEditCatalogueBundle] =
    React.useState<BundleCatalogue>(currCatBun);

  const [edit, setEdit] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(true);

  React.useEffect(() => {
    setDisableSave(!isValidBundleCatalogue(editCatalogueBundle));
  }, [editCatalogueBundle]);

  React.useEffect(() => {
    if (id) {
      setLoading(true);
      asyncFetchCallback(
        getBundleCatalogueById(id),
        (res) => {
          setOriginalCatalogueBundle(res);
          setEditCatalogueBundle(res);
          setSelectedBundle(res.bundle);
          setLoading(false);
        },
        () => {
          setAlert({
            severity: 'error',
            message:
              'Catalogue bundle does not exist. You will be redirected back to the Manage Bundle Catalogue page.'
          });
          setLoading(false);
          setTimeout(() => navigate('/catalogue/allCatalogueBundles'), 3500);
        }
      );
    }
  }, [id, navigate]);

  const handleEditCatalogueBundle = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNumber: boolean = false
  ) => {
    const value = isNumber ? parseInt(e.target.value) : e.target.value;
    setEditCatalogueBundle(
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

    setEditCatalogueBundle((prev) => ({
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
            setEditCatalogueBundle((prev) => {
              console.log(res);
              if (prev) {
                return { ...prev, image: res as string };
              } else {
                return prev;
              }
            }),
          (err) => console.log(err)
        );
        setEditCatalogueBundle((prev) => ({
          ...prev,
          file: e.target.files![0]
        }));
      }
    }
  };

  const handleSave = async () => {
    if (editCatalogueBundle) {
      console.log('edited: ', editCatalogueBundle);
      setLoading(true);
      setLoading(true);
      let formData = new FormData();
      formData.append('file', editCatalogueBundle.file as File);
      formData.append('id', String(editCatalogueBundle.id));
      formData.append('price', String(editCatalogueBundle.price));
      formData.append('bundle', JSON.stringify(editCatalogueBundle.bundle));
      formData.append('description', String(editCatalogueBundle.description));
      await asyncFetchCallback(
        updateBundleCatalogue(formData),
        () => {
          setLoading(false);
          setOriginalCatalogueBundle(editCatalogueBundle);
          setAlert({
            severity: 'success',
            message: 'Catalogue bundle edited successfully!'
          });
        },
        (err) => {
          setLoading(false);
          setEditCatalogueBundle(originalCatalogueBundle);
          const resData = err.response?.data as AxiosErrDataBody;
          setAlert({
            severity: 'error',
            message: `Error editing catalogue bundle: ${resData.message}`
          });
        }
      );
    }
  };

  const handleDeleteCatalogueBundle = async () => {
    setModalOpen(false);
    setBackdropLoading(true);
    if (originalCatalogueBundle) {
      setLoading(false);
      asyncFetchCallback(
        deleteBundleCatalogue(originalCatalogueBundle.id),
        () => {
          setBackdropLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Catalogue bundle successfully deleted. You will be redirected back to the Manage Product Catalogue page now.'
          });
          setTimeout(() => navigate('/catalogue/allCatalogueBundles'), 3500);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setBackdropLoading(false);
          setAlert({
            severity: 'error',
            message: `Error deleting catalogue bundle: ${resData.message}`
          });
        }
      );
    }
  };

  const title = `${edit ? 'Edit' : ''} Catalogue Bundle Details`;

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
                    setEditCatalogueBundle(originalCatalogueBundle);
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
                onConfirm={handleDeleteCatalogueBundle}
                title='Delete Catalogue Bundle'
                body='Are you sure you want to delete this catalogue bundle?'
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
                        border: editCatalogueBundle?.image
                          ? ''
                          : '1px solid lightgray'
                      }}
                      className={
                        editCatalogueBundle?.image ? '' : 'container-center'
                      }
                    >
                      {editCatalogueBundle?.image ? (
                        <img
                          src={editCatalogueBundle.image}
                          alt='Bundle'
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      ) : (
                        <Typography>Bundle Image</Typography>
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
                        {editCatalogueBundle?.image && (
                          <IconButton
                            onClick={() => {
                              // @ts-ignore
                              imgRef.current.value = null;
                              setEditCatalogueBundle((prev) => {
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
                        label='Bundle Name'
                        name='bundleName'
                        defaultValue=' '
                        value={selectedBundle?.name}
                        variant='filled'
                        disabled
                        fullWidth
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Bundle Name: ${editCatalogueBundle?.bundle.name}`}</Typography>
                    )}
                    {edit ? (
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
                    ) : (
                      <Typography sx={{ padding: '15px' }}>{`Bundle Products: ${
                        editCatalogueBundle?.bundle.bundleProduct
                          .map((bp) => bp.product.name)
                          .join(', ') ?? []
                      }`}</Typography>
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
                        value={editCatalogueBundle?.price}
                        inputProps={{
                          inputMode: 'decimal',
                          min: '0',
                          step: '0.01'
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Price: ${editCatalogueBundle?.price.toFixed(
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
                    value={editCatalogueBundle?.description}
                    onChange={handleEditCatalogueBundle}
                    placeholder='eg.: Our best-selling set to date!'
                    multiline
                    rows={4}
                  />
                ) : editCatalogueBundle?.description ? (
                  <Typography
                    sx={{ padding: '15px' }}
                  >{`Description: ${editCatalogueBundle?.description}`}</Typography>
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

export default CatalogueBundleDetails;
