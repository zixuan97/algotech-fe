import React, { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { ChevronLeft, Delete } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { Bundle, BundleCatalogue } from 'src/models/types';
import '../../styles/pages/delivery/delivery.scss';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  createBundleCatalogue,
  getAllBundleCatalogues
} from '../../services/bundleCatalogueService';
import { isValidBundleCatalogue } from 'src/components/catalogue/catalogueHelper';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from 'src/components/common/TimeoutAlert';
import inventoryContext from 'src/context/inventory/inventoryContext';
import { getBase64 } from 'src/utils/fileUtils';
import { omit } from 'lodash';
import { getAllBundles } from 'src/services/bundleService';

const CreateCatalogueBundle = () => {
  const navigate = useNavigate();

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
            <h1>Create Bundle Catalogue Item</h1>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default CreateCatalogueBundle;
