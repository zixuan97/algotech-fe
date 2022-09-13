import React, { useState } from 'react';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  MenuItem,
  Button,
  CircularProgress,
  Tooltip,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { Category, Product, ProductCategory } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllProductCategories } from 'src/services/productService';
import { intersectionWith } from 'lodash';

type NewCategory = Partial<Category> & {
};

const CreateCategory = () => {
  const navigate = useNavigate();

  const [newCategory, setNewCategory] = React.useState<NewCategory>({});
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    asyncFetchCallback(getAllProductCategories(), setCategories);
  }, []);

  console.log(newCategory);

  const handleEditCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleEditCategories = (e: SelectChangeEvent<string[]>) => {
    const inputCategories = e.target.value;
    setNewCategory((prev) => {
      if (prev) {
        return {
          ...prev,
          categories: intersectionWith(
            categories,
            inputCategories,
            (a, b) => a.name === b
          )
        };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async () => {
    if (newCategory) {
      // await asyncFetchCallback(updateProduct(newProduct), (res) => {
      //   setLoading(false);
      // });
    }
  };

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
            <h1>Create Category</h1>
          </div>
          <Paper elevation={2}>
            <form>
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
                  <Button variant='text' className='cancel-btn' color='primary'>
                    CANCEL
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    className='create-btn'
                    color='primary'
                  >
                    CREATE CATEGORY
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
