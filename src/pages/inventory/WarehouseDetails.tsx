import React from 'react';
import { useNavigate, createSearchParams, useSearchParams, useLocation } from 'react-router-dom';
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
import _, { omit } from 'lodash';
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
  const [editAddProductsId, setEditAddProductsId] = React.useState<number[]>([]);

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
  // const [newStockQtyPdts, setNewStockQtyPdts] = React.useState<NewStockQuantityProduct[]>([]);

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

        res.stockQuantity.forEach((sq) => 
          {if (sq.productId) {
            addedProductsId.push(sq.productId);
          } else if (sq.product) {
            addedProductsId.push(sq.product.id);
          }}
        );
        setAddedProductsId(addedProductsId);
        console.log("addedProductsId", addedProductsId);
      
        setLoading(false);
      });
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

    console.log("selected_product", selectedProduct);
    console.log("quantity", quantity);

    if (selectedProduct && id) {
      let newStockQtyPdt: StockQuantity = {
        locationId: parseInt(id),
        quantity: parseInt(quantity),
        product: selectedProduct
      };
      console.log("new_stock_qty_pdt:", newStockQtyPdt);

      let updatedStockQtyPdts = Object.assign([], stockQuantityDetails);
      console.log("updatedStockQtyPdts", updatedStockQtyPdts);

      setAddedProductsId((prev) => [...prev, selectedProduct.id]);
      setEditAddProductsId((prev) => [...prev, selectedProduct.id]);

      updatedStockQtyPdts.push(newStockQtyPdt);
      console.log("updatedStockQtyPdts AFTER PUSH", updatedStockQtyPdts);

      setStockQuantityDetails(updatedStockQtyPdts);

      setLoading(false);
      setAlert({
        severity: 'success',
        message: 'Product added to warehouse successfully! Remember to save changes.'
      });
    }
  };

  const removeStockQtyPdt = (delId: string) => {
    console.log("id to be deleted:", delId);
    const updatedStockQtyPdts = stockQuantityDetails.filter(
      (item) => item.product?.id.toString() !== delId
    );
    setStockQuantityDetails(updatedStockQtyPdts);
    console.log("remove: updatedStockQtyPdts", updatedStockQtyPdts)

    const updatedAddedProductsId = addedProductsId.filter(
      (item) => item.toString() !== delId
    );
    setAddedProductsId(updatedAddedProductsId);

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
        if (!edit) {
          return (
          <Button
            variant='contained'
            onClick={() =>
              navigate({
                pathname: '/inventory/productDetails',
                search: createSearchParams({
                  id: id.toString()
                }).toString()
              })
            }
          >
          View Details
          </Button>
          )
        } else {
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
      }
    }
  ];

  const handleSave = async () => {
    if (editLocation || stockQuantityDetails) {
      setBackdropLoading(true);

      let finalNewLocationStockQtyPdts = stockQuantityDetails.map(
        ({locationId, product, quantity}) => ({
          locationId: locationId!,
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

      //this line isnt working?? why
      // setEditLocation(reqBody);

      console.log("REQUEST BODY:", reqBody);

      asyncFetchCallback(
        // updateLocationWithoutProducts(editLocation),
        updateLocation(reqBody),
        () => {
          setEditLocation((editLocation) => {
            if (editLocation) {
              return {
                ...editLocation,
                name: editLocation.name,
                address: editLocation.address,
                stockQuantity: finalNewLocationStockQtyPdts
              };
            } else {
              return editLocation;
            }
          });
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
                    // console.log("edit_location", editLocation);
                    console.log("original_location", originalLocation);
                    if (originalLocation) {
                      //gives original array
                      console.log("original_location stock qty", originalLocation?.stockQuantity);
                      
                      //this line isnt working
                      // setStockQuantityDetails(originalLocation?.stockQuantity);

                      console.log("products to be reset_editProdId:", editAddProductsId);

                      const updatedStockQtyPdts = stockQuantityDetails.filter(
                        (item) => { if (item.product) {
                          return !editAddProductsId.includes(item.product?.id);
                        } else if (item.productId) {
                          return !editAddProductsId.includes(item.productId);
                        } else {
                          return false;
                        }}
                      );
                      console.log("remove: updatedStockQtyPdts", updatedStockQtyPdts)
                      
                      //this line isnt working
                      setStockQuantityDetails(updatedStockQtyPdts);

                      console.log("DISCARD stock qty", stockQuantityDetails);
                      //should give original array
                      
                      //this isnt working
                      setAddedProductsId([]);

                      originalLocation?.stockQuantity.forEach((sq) => 
                        {if (sq.productId) {
                          addedProductsId.push(sq.productId);
                        } else if (sq.product) {
                          addedProductsId.push(sq.product.id);
                        }}
                      );
                      setAddedProductsId(addedProductsId);

                    }

                    //this isnt working either
                    setEditAddProductsId([]);

                    console.log("DISCARD editAddProductsId", editAddProductsId);
                    console.log("DISCARD addedProductsId", addedProductsId);
                    // var filtered = addedProductsId.filter((item) => !editAddProductsId.includes(item));
                    // console.log("filtered", filtered);
                    
                    // console.log("set to 0", addedProductsId);
                    // setAddedProductsId(filtered);
                    // console.log("DISCARD after filter addedProductsId", addedProductsId);


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
