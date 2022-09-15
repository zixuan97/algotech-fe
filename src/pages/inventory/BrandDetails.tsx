import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { Brand, Product } from '../../models/types';
import ProductCellAction from '../../components/inventory/ProductCellAction';
import {
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandById,
} from '../../services/brandService';
import { getProductById } from '../../services/productService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { toast } from 'react-toastify';

const columns: GridColDef[] = [
  {
    field: 'productName',
    headerName: 'Product Name',
    flex: 2
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
};
  
const BrandDetails = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const current = useLocation();
  const brand = current.state as Brand;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [originalBrand, setOriginalBrand] = React.useState<Brand>();
  const [editBrand, setEditBrand] = React.useState<Brand>(brand);
  const [productDetails, setProductDetails] = React.useState<
    ProductDetails[]
  >([]);
  const [edit, setEdit] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (id) {
      asyncFetchCallback(getBrandById(id), (res) => {
        setOriginalBrand(res);
        setEditBrand(res);
        setLoading(false);
      });
    }
  }, [id]);

  React.useEffect(() => {
    if (originalBrand) {
      Promise.all(
        originalBrand.product.map(async (qty) => {
          const product = await getProductById(qty.id);
          return {
            id: qty.id,
            productName: product.name,
          };
        })
      ).then((res) => setProductDetails(res));
    }
  }, [originalBrand]);

const handleFieldOnChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  key: string
) => {
  setEditBrand((brand: Brand) => {
      return {
          ...brand,
          [key]: event.target.value
      };
  });
};

const handleSave = async() => {
  setLoading(true);
  if (editBrand) {
    setLoading(false);
    asyncFetchCallback(
      updateBrand(editBrand),
      () => {
        toast.success('Brand successfully edited.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        // navigate('/inventory/allBrands');
      },
      () => {
        toast.error('Error editing brand! Try again later.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        // navigate('/inventory/allBrands');
      }
    );
  }
}

const handleDeleteBrand = async () => {
  setLoading(true);
  if (originalBrand) {
    setLoading(false);
    asyncFetchCallback(
      deleteBrand(originalBrand.id),
      () => {
        toast.success('Brand successfully deleted.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        navigate('/inventory/allBrands');
      },
      () => {
        toast.error('Error deleting brand! Try again later.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        navigate('/inventory/allBrands');
      }
    );
  }
}


const title = `${edit ? 'Edit' : ''} Brand Details`;

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
              {edit ? 'Save Changes' : 'Edit'}
            </Button>
            {edit && (
              <Button
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={() => {
                  setEdit(false);
                  // setEditBrand(originalBrand);
                }}
              >
                Discard Changes
              </Button>
            )}
            <Button
              // disabled={!!productDetails.length}
              variant='contained'
              className='create-btn'
              color='primary'
              onClick={() => setModalOpen(true)}
            >
              Delete
            </Button>

            {/* <Tooltip title={"Contact Zac to delete any brands."}>
              <span>
                <Button
                  disabled
                  variant='contained'
                  className='create-btn'
                  color='primary'
                  >
                    Delete
                  </Button>
              </span>
            </Tooltip> */}

            <ConfirmationModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={handleDeleteBrand}
              title='Delete Brand'
              body='Are you sure you want to delete this brand?
              Note that deleting brands with associated products will cause the associated products to be deleted too.'
            />
          </div>
        </div>
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
                      label='Brand Name'
                      name='name'
                      value={editBrand?.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFieldOnChange(e, 'name')
                      }
                      placeholder='eg.: Kettle Gourmet'
                    />
                  ) : (
                    <Typography
                      sx={{ padding: '15px' }}
                    >{`Brand Name: ${editBrand?.name}`}</Typography>
                  )}
                  
                </div>
              </div>
              {/* product table */}
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
);
};

export default BrandDetails;