import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { Location } from 'src/models/types';
import ProductCellAction from 'src/components/inventory/ProductCellAction';
import {
  deleteLocation,
  getLocationById,
  updateLocation
} from 'src/services/locationService';
import {
  getProductById
} from 'src/services/productService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import { toast } from 'react-toastify';

const columns: GridColDef[] = [
  {
    field: 'productName',
    headerName: 'Product Name',
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
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    flex: 1,
    renderCell: ProductCellAction
  }
];

interface ProductDetails {
  id: number
  productName: string;
  quantity: number;
  price: number;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

const LocationDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = React.useState<boolean>(true);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [originalLocation, setOriginalLocation] = React.useState<Location>();
  const [editLocation, setEditLocation] = React.useState<Location>();
  const [productDetails, setProductDetails] = React.useState<
    ProductDetails[]
  >([]);
  const [edit, setEdit] = React.useState<boolean>(false);

  const handleDeleteButtonClick = () => {
    setLoading(true);
    if (originalLocation) {
      setLoading(false);
      asyncFetchCallback(
      deleteLocation(originalLocation.id),
      () => {
        toast.success('Warehouse successfully deleted.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        navigate('/inventory/warehouses');
      },
      () => {
        toast.error('Error deleting warehouse! Try again later.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        navigate('/inventory/warehouses');
      });
    }
  }


  React.useEffect(() => {
    if (id) {
      asyncFetchCallback(getLocationById(id), (res) => {
        setOriginalLocation(res);
        setEditLocation(res);
        setLoading(false);
      });
    }
  }, [id]);

  React.useEffect(() => {
    if (originalLocation) {
      Promise.all(
        originalLocation.stockQuantity.map(async (qty) => {
          const product = await getProductById(qty.product_id);
          return {
            id: qty.product_id,
            productName: product.name,
            quantity: qty.quantity,
            price: qty.price
          };
        })
      ).then((res) => setProductDetails(res));
    }
  }, [originalLocation]);

  console.log(editLocation);

  const handleEditLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditLocation((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    if (editLocation) {
      await asyncFetchCallback(updateLocation(editLocation), (res) => {
        setLoading(false);
      });
    }
  };

  const [open, setOpen] = React.useState(false);

  const title = `${edit ? 'Edit' : ''} Warehouse Details`;

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
              {/* need to handle the cannot save after x seconds */}
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
                //disable --> if array !empty, disabled = true
                // disabled={!!productDetails.length}
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
                onConfirm={handleDeleteButtonClick}
                title='Delete Warehouse'
                body='Are you sure you want to delete this warehouse?'
              />
            </div>
          </div>
          <Paper elevation={2}>
            <form>
              <FormGroup className='create-product-form'>
                <div className='top-content'>
                  <div className='text-fields'>
                    {edit ? (
                      <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Warehouse Name'
                      name='name'
                      value={editLocation?.name}
                      onChange={handleEditLocation}
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
                      onChange={handleEditLocation}
                      placeholder='eg.: 123 Chai Chee Road, #01-02, Singapore 12345'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                        >{`Address: ${editLocation?.address}`}</Typography>
                    )}

                  </div>
                </div>
                {/*product table*/}
                <DataGrid
                  columns={columns}
                  rows={productDetails}
                  autoHeight
                  pageSize={5}
                />
              </FormGroup>
            </form>
          </Paper>
        </Box>
      </div>
    </div>
  )

}

export default LocationDetails;