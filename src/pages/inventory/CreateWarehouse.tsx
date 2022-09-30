import React, { FormEvent } from 'react';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Backdrop,
  CircularProgress
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { Location } from '../../models/types';
import { createLocation } from '../../services/locationService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
 } from 'src/components/common/TimeoutAlert';
// import StockQuantityProductModal from 'src/components/inventory/StockQuantityProductModal';
// import { getAllProducts } from 'src/services/productService';
// import { useSearchParams } from 'react-router-dom';
// import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
// import DeleteIcon from '@mui/icons-material/Delete';

export type NewLocation = Partial<Location> & {};
// type NewStockQuantityProduct = Partial<StockQuantity>;

const CreateWarehouse = () => {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  // const id = searchParams.get('id');

  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newLocation, setNewLocation] = React.useState<NewLocation>({});

  // const [newStockQtyPdts, setNewStockQtyPdts] = React.useState<NewStockQuantityProduct[]>([]);

  // const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  // const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  // const [addedProductsId, setAddedProductsId] = React.useState<number[]>([]);
  // const [productIdToDisplay, setProductIdToDisplay] = React.useState<number>();


  // const columns: GridColDef[] = [
  //   {
  //     field: 'sku',
  //     headerName: 'SKU',
  //     flex: 1,
  //     valueGetter: (params: GridValueGetterParams) => params.row.product.sku
  //   },
  //   {
  //     field: 'name',
  //     headerName: 'Product Name',
  //     flex: 1,
  //     valueGetter: (params: GridValueGetterParams) => params.row.product.name
  //   },
  //   { field: 'quantity', headerName: 'Quantity', flex: 1 },
  //   {
  //     field: 'actions',
  //     headerName: 'Actions',
  //     flex: 1,
  //     renderCell: ({ id }: GridRenderCellParams) => {
  //       return (
  //         <Button
  //           variant='outlined'
  //           startIcon={<DeleteIcon />}
  //           onClick={() => removeStockQtyPdt(id.toString())}
  //         >
  //           Delete
  //         </Button>
  //       );
  //     }
  //   }
  // ]

  // React.useEffect(() => {
  //   asyncFetchCallback(getAllProducts(), setAllProducts);
  //   if (id) {
  //     setModalOpen(true);
  //     setProductIdToDisplay(parseInt(id));
  //   }
  // }, [id]);

  const handleEditLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLocation((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  // const handleAddStockQtyPdt = async (
  //   quantity: string,
  //   selectedProduct: Product | undefined
  // ) => {
  //   setModalOpen(false);
  //   setLoading(true);

  //   if (selectedProduct) {
  //     let newStockQtyPdt: NewStockQuantityProduct = {
  //       quantity: parseInt(quantity),
  //       product: selectedProduct
  //     };
  //     let updatedStockQtyPdts = Object.assign([], newStockQtyPdts);
  //     setAddedProductsId((prev) => [...prev, selectedProduct.id]);
  //     updatedStockQtyPdts.push(newStockQtyPdt);
  //     setNewStockQtyPdts(updatedStockQtyPdts);
  //     setLoading(false);
  //     setAlert({
  //       severity: 'success',
  //       message: 'Product added to warehouse successfully!'
  //     });
  //   }
  // };

  // const removeStockQtyPdt = (id: string) => {
  //   const updatedStockQtyPdts = newStockQtyPdts.filter(
  //     (item) => item.productId?.toString() != id
  //   );
  //   setNewStockQtyPdts(updatedStockQtyPdts);
  // }

  const handleSave = async (e: FormEvent) => {
    
    e.preventDefault();

    if (newLocation.name === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please enter a Warehouse name!'
      });
      return;
    }

    if (newLocation.address === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please enter a Warehouse address!'
      });
      return;
    }
    
    if (newLocation) {
      setLoading(true);

      // let finalNewLocationStockQtyPdts = newStockQtyPdts.map(
      //   ({product, quantity}) => ({
      //     product: product!,
      //     quantity: quantity!
      //   })
      // )

      let reqBody = {
        name: newLocation.name,
        address: newLocation.address,
        // stockQuantity: finalNewLocationStockQtyPdts
      }

      await asyncFetchCallback(
        createLocation(reqBody),
        (res) => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Warehouse successfully created! You will be redirected back to the All Warehouses page now.'
          });
          setTimeout(() => {
            navigate('/inventory/warehouses');
          }, 3000);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating warehouse: ${resData.message}`
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
            <h1>Create Warehouse</h1>
          </div>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
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
                      label='Warehouse Name'
                      name='name'
                      value={newLocation?.name}
                      onChange={handleEditLocation}
                      placeholder='eg.: Chai Chee Warehouse'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Address'
                      name='address'
                      value={newLocation?.address}
                      onChange={handleEditLocation}
                      placeholder='eg.: 123 Chai Chee Road, #01-02, Singapore 12345'
                    />
                  </div>
                </div>
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() =>
                      navigate({ pathname: '/inventory/warehouses' })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    className='create-btn'
                    color='primary'
                  >
                    Create Warehouse
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

export default CreateWarehouse;
