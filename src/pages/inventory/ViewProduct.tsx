import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  MenuItem,
  Button
} from '@mui/material';
import '../../styles/pages/inventory.scss';

const units = [
  {
    value: 'ea',
    label: 'Each'
  },
  {
    value: 'ptk',
    label: 'Packet'
  },
  {
    value: 'ctn',
    label: 'Carton'
  }
];

const categories = [
  {
    value: 'popcorn',
    label: 'Popcorn'
  },
  {
    value: 'sticks',
    label: 'Sticks'
  }
];

const tags = [
  {
    value: 'snack',
    label: 'Snack'
  },
  {
    value: 'nonSnack',
    label: 'Non Snack'
  }
];

const ViewProduct = () => {
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');

  const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnit(event.target.value);
  };
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };
  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value);
  };
  const navigate = useNavigate();

  return (
    <>
      <div className='createProduct'>
        <Box className='createProduct-box'>
          <div className='headerContent'>
            <h1>View Product: </h1>
            <div className='buttonGroup'>
              <Button
                type='submit'
                variant='contained'
                className='create-btn'
                color='primary'
              >
                EDIT
              </Button>
              <Button
                type='submit'
                variant='contained'
                className='create-btn'
                color='primary'
              >
                DELETE
              </Button>
            </div>
          </div>

          <Paper elevation={2}>
            <form>
              <FormGroup className='create-product-form'>
                <div className='topContent'>
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

                  <div className='textFields'>
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='SKU'
                      name='sku'
                      placeholder='eg.: SKU12345678'
                    />
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Product Name'
                      name='productName'
                      placeholder='eg.: Nasi Lemak Popcorn'
                    />
                    <div className='rowGroup'>
                      <TextField
                        required
                        fullWidth
                        id='outlined-field'
                        label='Price'
                        name='price'
                        placeholder='eg.: $10'
                      />

                      <TextField
                        required
                        fullWidth
                        id='outlined-field'
                        select
                        label='Unit'
                        value={unit}
                        onChange={handleUnitChange}
                      >
                        {units.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        required
                        fullWidth
                        id='outlined-quantity'
                        label='Quantity'
                        name='quantity'
                        placeholder='eg.: 12'
                      />
                    </div>
                  </div>
                </div>

                <div className='rowGroup'>
                  <TextField
                    id='outlined-select-category'
                    fullWidth
                    select
                    label='Category'
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    {categories.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    id='outlined-select-unit'
                    fullWidth
                    select
                    label='Tags'
                    value={tag}
                    onChange={handleTagChange}
                  >
                    {tags.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <TextField
                  id='standard-multiline-static'
                  label='Comments'
                  multiline
                  rows={3}
                  placeholder='Insert comments here...'
                  variant='standard'
                />

                <div className='viewButtonGroup'>
                  <Button
                    type='submit'
                    variant='contained'
                    className='create-btn'
                    color='primary'
                    onClick={() => {
                      navigate('/');
                    }}
                  >
                    Back
                  </Button>
                </div>
              </FormGroup>
            </form>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default ViewProduct;
