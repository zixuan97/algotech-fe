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

type NewProduct = Partial<Product> & {
  categories?: Category[];
};

const CreateProduct = () => {
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = React.useState<NewProduct>({});
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    asyncFetchCallback(getAllProductCategories(), setCategories);
  }, []);

  console.log(newProduct);

  const handleEditProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleEditCategories = (e: SelectChangeEvent<string[]>) => {
    const inputCategories = e.target.value;
    setNewProduct((prev) => {
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
    if (newProduct) {
      // await asyncFetchCallback(updateProduct(newProduct), (res) => {
      //   setLoading(false);
      // });
    }
  };

  return (
    <div>
      <Tooltip title='Return to Product Inventory' enterDelay={300}>
        <IconButton
          size='large'
          onClick={() => navigate({ pathname: '/inventory/allProducts' })}
        >
          <ChevronLeft />
        </IconButton>
      </Tooltip>
      <div className='create-product'>
        <Box className='create-product-box'>
          <div className='header-content'>
            <h1>Create Product</h1>
          </div>
          <Paper elevation={2}>
            <form>
              <FormGroup className='create-product-form'>
                <div className='top-content'>
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      backgroundColor: 'primary.dark',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        opacity: [0.9, 0.8, 0.7]
                      }
                    }}
                  />
                  <div className='text-fields'>
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='SKU'
                      name='sku'
                      value={newProduct?.sku}
                      onChange={handleEditProduct}
                      placeholder='eg.: SKU12345678'
                    />

                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Product Name'
                      name='name'
                      value={newProduct?.name}
                      onChange={handleEditProduct}
                      placeholder='eg.: Nasi Lemak Popcorn'
                    />

                    <FormControl>
                      <InputLabel id='productCategories-label'>
                        Categories
                      </InputLabel>
                      <Select
                        labelId='productCategories-label'
                        id='ProductCategories'
                        multiple
                        value={
                          newProduct?.categories?.map((cat) => cat.name) ?? []
                        }
                        onChange={handleEditCategories}
                        input={<OutlinedInput label='Categories' />}
                      >
                        {categories.map((option) => (
                          <MenuItem key={option.id} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      required
                      id='outlined-required'
                      label='Quantity Threshold'
                      name='qtyThreshold'
                      placeholder='e.g. 10'
                      onChange={handleEditProduct}
                      value={newProduct?.qtyThreshold}
                    />
                  </div>
                </div>
                {/* <DataGrid
					columns={columns}
					rows={locationDetails}
					getRowId={(row) => row.locationName}
					autoHeight
					pageSize={5}
				  /> */}
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
                    CREATE PRODUCT
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

export default CreateProduct;
