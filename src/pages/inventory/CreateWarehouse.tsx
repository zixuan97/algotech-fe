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
import { Location } from 'src/models/types';
// import asyncFetchCallback from 'src/services/util/asyncFetchCallback';

type NewLocation = Partial<Location>;

const CreateWarehouse = () => {
  const navigate = useNavigate();

  const [newLocation, setNewLocation] = React.useState<NewLocation>({});
  
  console.log(newLocation);

  const handleEditLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLocation((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async () => {
      if (newLocation) {
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
          <h1>Create Warehouse</h1>
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
                    onClick={() => navigate({ pathname: '/inventory/warehouses' })}
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
                      setNewLocation(newLocation);
                    }}
                  >
                    CREATE WAREHOUSE
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