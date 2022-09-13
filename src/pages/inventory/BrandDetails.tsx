import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  // MenuItem,
  Button,
  IconButton,
  Tooltip,
  Typography,
  // Select,
  // OutlinedInput,
  // FormControl,
  // InputLabel,
  // Chip,
  // SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { Brand, Product } from 'src/models/types';
import ProductCellAction from 'src/components/inventory/ProductCellAction';
import {
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandById,
} from 'src/services/productService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { intersectionWith } from 'lodash';
import ConfirmationModal from 'src/components/common/ConfirmationModal';

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

  const [loading, setLoading] = React.useState<boolean>(true);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [originalBrand, setOriginalBrand] = React.useState<Brand>();
  const [editBrand, setEditBrand] = React.useState<Brand>();
  const [productDetails, setProductDetails] = React.useState<
    ProductDetails[]
  >([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);
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

//   React.useEffect(() => {
//     if (originalCategory) {
//       Promise.all(
//         originalCategory.productCategory.map(async (qty) => {
//           const product = await getProductById(qty.product_id);
//           return {
//             id: qty.product_id,
//             productName: product.name,
//           };
//         })
//       ).then((res) => setProductDetails(res));
//     }
//   }, [originalCategory]);

React.useEffect(() => {
  asyncFetchCallback(getAllBrands(), setBrands);
}, []);

console.log(editBrand);

const handleEditBrand = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEditBrand((prev) => {
    if (prev) {
      return { ...prev, [e.target.name]: e.target.value };
    } else {
      return prev;
    }
  });
};

// const handleEditCategories = (e: SelectChangeEvent<string[]>) => {
//   const inputCategories = e.target.value;
//   setEditBrand((prev) => {
//     if (prev) {
//       return {
//         ...prev,
//         productCategory: intersectionWith(
//           brands,
//           inputCategories,
//           (a, b) => a.name === b
//         ).map((cat) => {
//           return {
//           //   product_sku: editCategory?.sku,
//             category_id: cat.id,
//             category_name: cat.name,
//             category: cat,
//             product: editBrand
//           } as ProductCategory;
//         })
//       };
//     } else {
//       return prev;
//     }
//   });
// };

const handleSave = async () => {
  setLoading(true);
  if (editBrand) {
    await asyncFetchCallback(updateBrand(editBrand), (res) => {
      setLoading(false);
    });
  }
};

const handleDeleteCategory = async () => {
  setLoading(true);
  if (originalBrand?.product.length) {
      //TODO: print failure; unable to delete toast
    navigate({ pathname: '/inventory/allCategories' });
    setLoading(false);
  }
  else if (originalBrand) {
    await asyncFetchCallback(
      deleteBrand(originalBrand.id),
      (res) => {
        setLoading(false);
        // TODO: print out success
        navigate({ pathname: '/inventory/allProducts' });
      },
      () => setLoading(false)
    );
  }
};

const title = `${edit ? 'Edit' : ''} Category Details`;

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
              {edit ? 'SAVE CHANGES' : 'EDIT'}
            </Button>
            {edit && (
              <Button
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={() => {
                  setEdit(false);
                  setEditBrand(originalBrand);
                }}
              >
                DISCARD CHANGES
              </Button>
            )}
            <Button
              disabled={!!productDetails.length}
              variant='contained'
              className='create-btn'
              color='primary'
              onClick={() => setModalOpen(true)}
            >
              DELETE
            </Button>
            <ConfirmationModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={handleDeleteCategory}
              title='Delete Brand'
              body='Are you sure you want to delete this brand?'
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
                      label='Brand Name'
                      name='name'
                      value={editBrand?.name}
                      onChange={handleEditBrand}
                      placeholder='eg.: Kettle Gourmet'
                    />
                  ) : (
                    <Typography
                      sx={{ padding: '15px' }}
                    >{`Category Name: ${editBrand?.name}`}</Typography>
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