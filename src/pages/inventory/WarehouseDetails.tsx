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
import { Location, Product, StockQuantity } from '../../models/types';
import ProductCellAction from '../../components/inventory/ProductCellAction';
import {
  deleteLocation,
  getLocationById,
  updateLocation,
  updateLocationWithoutProducts
} from '../../services/locationService';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { omit } from 'lodash';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
 } from 'src/components/common/TimeoutAlert';
import StockQuantityProductModal from 'src/components/inventory/StockQuantityProductModal';
import { getAllProducts } from 'src/services/productService';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

export type NewLocation = Partial<Location> & {};
type NewStockQuantityProduct = Partial<StockQuantity>;


const LocationDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const current = useLocation();
  const location = current.state as Location;

  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [addedProductsId, setAddedProductsId] = React.useState<number[]>([]);
  const [productIdToDisplay, setProductIdToDisplay] = React.useState<number>();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [tableLoading, setTableLoading] = React.useState<boolean>(false);
  const [backdropLoading, setBackdropLoading] = React.useState<boolean>(false);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [originalLocation, setOriginalLocation] =
    React.useState<Location>(location);
  const [editLocation, setEditLocation] = React.useState<Location>(location);

  const [stockQuantityDetails, setStockQuantityDetails] = React.useState<StockQuantity[]>(
    []
  );
  const [newStockQtyPdts, setNewStockQtyPdts] = React.useState<NewStockQuantityProduct[]>([]);

  const [edit, setEdit] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(true);

  React.useEffect(() => {
    id &&
      asyncFetchCallback(getLocationById(id), (location: Location) => {
        if (location) {
          setOriginalLocation(location);
          setLoading(false);
        } else {
          setAlert({
            severity: 'error',
            message:
              'Location does not exist. You will be redirected back to the Manage Warehouses page.'
          });
          setLoading(false);
          setTimeout(() => navigate('/inventory/warehouses'), 3500);
        }
      });
  }, [id, navigate]);

  React.useEffect(() => {
    const shouldDisable = !(editLocation?.name && editLocation?.address);
    setDisableSave(shouldDisable);
  }, [editLocation?.name, editLocation?.address]);

  React.useEffect(() => {
    if (id) {
      asyncFetchCallback(getAllProducts(), setAllProducts);

      asyncFetchCallback(getLocationById(id), (res) => {
        setOriginalLocation(res);
        setEditLocation(res);
        setLoading(false);
      });

      // setModalOpen(true);
      setProductIdToDisplay(parseInt(id));

    }
  }, [id]);

  React.useEffect(() => { 
    setTableLoading(true);
    if (originalLocation) {
      setStockQuantityDetails(originalLocation?.stockQuantity);
    }
    setTableLoading(false);
}, [originalLocation]);

  const handleDeleteButtonClick = () => {
    setDeleteModalOpen(false);
    setBackdropLoading(true);
    if (originalLocation) {
      asyncFetchCallback(
        deleteLocation(originalLocation.id),
        () => {
          setBackdropLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Warehouse successfully deleted. You will be redirected to the Manage Warehouses page now.'
          });
          setTimeout(() => navigate('/inventory/warehouses'), 3500);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setBackdropLoading(false);
          setAlert({
            severity: 'error',
            message: `Error deleting warehouse: ${resData.message}`
          });
        }
      );
    }
  };

  const handleFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditLocation((location: Location) => {
      return {
        ...location,
        [key]: event.target.value
      };
    });
  };

  const handleAddStockQtyPdt = async (
    quantity: string,
    selectedProduct: Product | undefined
  ) => {
    setModalOpen(false);
    setLoading(true);

    if (selectedProduct) {
      let newStockQtyPdt: NewStockQuantityProduct = {
        quantity: parseInt(quantity),
        product: selectedProduct
      };
      let updatedStockQtyPdts = Object.assign([], newStockQtyPdts);
      setAddedProductsId((prev) => [...prev, selectedProduct.id]);
      updatedStockQtyPdts.push(newStockQtyPdt);
      setNewStockQtyPdts(updatedStockQtyPdts);
      setLoading(false);
      setAlert({
        severity: 'success',
        message: 'Product added to warehouse successfully!'
      });
    }
  };

  const removeStockQtyPdt = (id: string) => {
    const updatedStockQtyPdts = newStockQtyPdts.filter(
      (item) => item.productId?.toString() != id
    );
    setNewStockQtyPdts(updatedStockQtyPdts);
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 2,
      valueGetter: (params: GridValueGetterParams) => params.row.product.name
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ id }: GridRenderCellParams) => {
        return (
          <Button
            variant='outlined'
            startIcon={<DeleteIcon />}
            onClick={() => removeStockQtyPdt(id.toString())}
          >
            Delete
          </Button>
        );
      }
      // renderCell: ({ id }: GridRenderCellParams) => {
      //   if (!edit) {
      //     return ProductCellAction;
      //   } else {
      //     return (
      //       <Button
      //         variant='outlined'
      //         startIcon={<DeleteIcon />}
      //         onClick={() => removeStockQtyPdt(id.toString())}
      //       >
      //         Delete
      //       </Button>
      //     );
      //   }
      // }
    }
  ];

  const handleSave = async () => {
    if (editLocation || newStockQtyPdts) {
      setBackdropLoading(true);

      let finalNewLocationStockQtyPdts = newStockQtyPdts.map(
        ({product, quantity}) => ({
          product: product!,
          quantity: quantity!
        })
      )

      let reqBody = {
        id: editLocation.id,
        name: editLocation.name,
        address: editLocation.address,
        stockQuantity: finalNewLocationStockQtyPdts
      }

      setEditLocation(reqBody);

      console.log("REQUEST BODY");
      console.log(reqBody);

      asyncFetchCallback(
        // updateLocationWithoutProducts(editLocation),
        updateLocation(editLocation),
        () => {
          setAlert({
            severity: 'success',
            message: 'Warehouse successfully edited.'
          });
          setBackdropLoading(false);
          setEditLocation(editLocation);
          setOriginalLocation(editLocation);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setBackdropLoading(false);
          setAlert({
            severity: 'error',
            message: `Error editing warehouse: ${resData.message}`
          });
        }
      );
    }
  };

  const title = `${edit ? 'Edit' : ''} Warehouse Details`;

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
              {/* need to handle the cannot save after x seconds */}
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
                    setEditLocation(originalLocation);
                  }}
                >
                  Discard Changes
                </Button>
              )}
              <Button
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={() => setDeleteModalOpen(true)}
              >
                Delete
              </Button>
              <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteButtonClick}
                title='Delete Warehouse'
                body='Are you sure you want to delete this warehouse?'
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
                        label='Warehouse Name'
                        name='name'
                        value={editLocation?.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldOnChange(e, 'name')
                        }
                        placeholder='eg.: Chai Chee Warehouse'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Warehouse Name: ${editLocation?.name}`}</Typography>
                    )}

                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-required'
                        label='Address'
                        name='address'
                        value={editLocation?.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldOnChange(e, 'address')
                        }
                        placeholder='eg.: 123 Chai Chee Road, #01-02, Singapore 12345'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Address: ${editLocation?.address}`}</Typography>
                    )}
                  </div>
                </div>
                  {/* <b>Products in Warehouse</b> */}
                  <DataGrid
                    columns={columns}
                    rows={stockQuantityDetails}
                    getRowId={(row) => row.product.id}
                    loading={tableLoading}
                    autoHeight
                    pageSize={10}
                  />
                  {edit && (
                    <Button
                    variant='contained'
                    size='medium'
                    sx={{ height: 'fit-content' }}
                    onClick={() => setModalOpen(true)}
                    >
                      Add Product to Warehouse
                    </Button>
                  )}

                  <StockQuantityProductModal
                    productIdToDisplay={productIdToDisplay}
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onConfirm={handleAddStockQtyPdt}
                    title='Add Product to Warehouse'
                    addedProductsId={addedProductsId}
                  />
                {/*product table*/}
                {/* {!edit && (
                  <DataGrid
                    columns={columns}
                    rows={stockQuantityDetails}
                    getRowId={(row) => row.product.id}
                    loading={tableLoading}
                    autoHeight
                    pageSize={5}
                  />
                )} */}
              </FormGroup>
            </form>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default LocationDetails;
