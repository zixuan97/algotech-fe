import React, { FormEvent } from 'react';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Alert,
  Backdrop,
  CircularProgress
  // Snackbar,
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { Category } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  createCategory,
  getAllProductCategories
} from '../../services/categoryService';
import { AlertType } from '../../components/common/Alert';

export type NewCategory = Partial<Category>;

const CreateCategory = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newCategory, setNewCategory] = React.useState<NewCategory>({});
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    asyncFetchCallback(getAllProductCategories(), setCategories);
  }, []);

  const handleEditCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (newCategory) {
      setLoading(true);
      await asyncFetchCallback(
        createCategory(newCategory),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message: 'Category successfully created!'
          });
        },
        (err) => {
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating category: ${err.message}`
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
            <h1>Create Category</h1>
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
                  <TextField
                    required
                    fullWidth
                    id='outlined-required'
                    label='Category Name'
                    name='name'
                    value={newCategory?.name}
                    onChange={handleEditCategory}
                    placeholder='eg.: Asian Favourites'
                  />
                </div>
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() =>
                      navigate({ pathname: '/inventory/allCategories' })
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
                    Create Category
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

export default CreateCategory;
