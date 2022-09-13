import React, { useState } from 'react';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  // MenuItem,
  Button,
  // CircularProgress,
  Tooltip,
  IconButton,
  // Typography,
  // FormControl,
  // InputLabel,
  // Select,
  // OutlinedInput,
  // Chip,
  // SelectChangeEvent
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { Brand } from 'src/models/types';
// import asyncFetchCallback from 'src/services/util/asyncFetchCallback';

type NewBrand = Partial<Brand>;

const CreateBrand = () => {

  const navigate = useNavigate();

  const [newBrand, setNewBrand] = React.useState<NewBrand>({});
  
  console.log(newBrand);

  const handleEditBrand = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBrand((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async () => {
      if (newBrand) {
        // await asyncFetchCallback(updateLocation(newLocation), (res) => {
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
          <h1>Create Brand</h1>
        </div>
        <Paper elevation={2}>
            <form>
              <FormGroup className='create-product-form'>
                <div className='top-content'>
                  <div className='text-fields'>
                      <TextField
                        required
                        fullWidth
                        id='outlined-required'
                        label='Brand Name'
                        name='name'
                        value={newBrand?.name}
                        onChange={handleEditBrand}
                        placeholder='eg.: Kettle Gourmet'
                      />
                  </div>
                </div>
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() => navigate({ pathname: '/inventory/allBrands' })}
                    >
                    CANCEL
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    className='create-btn'
                    color='primary'
                    onClick={() => {
                      // setEdit(false);
                      setNewBrand(newBrand);
                    }}
                  >
                    CREATE BRAND
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

export default CreateBrand;