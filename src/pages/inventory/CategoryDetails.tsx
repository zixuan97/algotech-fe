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
  CircularProgress,
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { Category, Product } from '../../models/types';
import ProductCellAction from '../../components/inventory/ProductCellAction';
import {
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../../services/categoryService';
import {
  getAllProductsByCategory,
  getProductById
} from '../../services/productService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
 } from 'src/components/common/TimeoutAlert';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Product Name',
    flex: 2
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: ProductCellAction
  }
];

const CategoryDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const current = useLocation();
  const category = current.state as Category;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [tableLoading, setTableLoading] = React.useState<boolean>(false);
  const [backdropLoading, setBackdropLoading] = React.useState<boolean>(false);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [originalCategory, setOriginalCategory] =
    React.useState<Category>(category);
  const [editCategory, setEditCategory] = React.useState<Category>(category);
  const [productDetails, setProductDetails] = React.useState<Product[]>(
    []
  );

  const [edit, setEdit] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(true);

  React.useEffect(() => {
    id &&
      asyncFetchCallback(getCategoryById(id), (category: Category) => {
        if (category) {
          setOriginalCategory(category);
          setLoading(false);
        } else {
          setAlert({
            severity: 'error',
            message:
              'Category does not exist. You will be redirected back to the Manage Categories page.'
          });
          setLoading(false);
          setTimeout(() => navigate('/inventory/allCategories'), 3500);
        }
      });
  }, [id, navigate]);

  React.useEffect(() => {
    const shouldDisable = !(
      editCategory?.name && productDetails //editCategory?.productCategory
    );
    setDisableSave(shouldDisable);
}, [editCategory?.name, productDetails]);

  React.useEffect(() => {
    setTableLoading(true);
    if (id) {
      asyncFetchCallback(getCategoryById(id), (res) => {
        setOriginalCategory(res);
        setEditCategory(res);

        asyncFetchCallback(getAllProductsByCategory(id), setProductDetails);
        setTableLoading(false);

        setLoading(false);
      });
    }
  }, [id]);

  const handleDeleteButtonClick = () => {
    setModalOpen(false);
    setBackdropLoading(true);
    if (originalCategory) {
      asyncFetchCallback(
        deleteCategory(originalCategory.id),
        () => {
          setBackdropLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Category successfully deleted. You will be redirected to the Manage Categories page now.'
          });
          setTimeout(() => navigate('/inventory/allCategories'), 3500);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setBackdropLoading(false);
          setAlert({
            severity: 'error',
            message: `Error deleting category: ${resData.message}`
          });
        }
      );
    }
  };

  const handleFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditCategory((category: Category) => {
      return {
        ...category,
        [key]: event.target.value
      };
    });
  };

  const handleSave = async () => {
    if (editCategory) {
      setBackdropLoading(true);
      asyncFetchCallback(
        updateCategory(editCategory),
        () => {
          setAlert({
            severity: 'success',
            message: 'Category successfully edited.'
          });
          setBackdropLoading(false);
          setEditCategory(editCategory);
          setOriginalCategory(editCategory);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setBackdropLoading(false);
          setAlert({
            severity: 'error',
            message: `Error editing category: ${resData.message}`
          });
        }
      );
    }
  };

  const title = `${edit ? 'Edit' : ''} Category Details`;

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
                    setEditCategory(originalCategory);
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
                onConfirm={handleDeleteButtonClick}
                title='Delete Category'
                body='Are you sure you want to delete this category?'
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
                        label='Category Name'
                        name='name'
                        value={editCategory?.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldOnChange(e, 'name')
                        }
                        placeholder='eg.: Asian Favourites'
                      />
                    ) : (
                      <Typography
                        sx={{ padding: '15px' }}
                      >{`Category Name: ${editCategory?.name}`}</Typography>
                    )}
                  </div>
                </div>
                {/* product table */}
                {!edit && (
                  <DataGrid
                    columns={columns}
                    rows={productDetails}
                    loading={tableLoading}
                    autoHeight
                    pageSize={5}
                  />
                )}
              </FormGroup>
            </form>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default CategoryDetails;
