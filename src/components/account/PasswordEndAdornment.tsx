import { VisibilityOff, Visibility } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import React from 'react';

interface props {
  showPassword: boolean;
  setShowPassword: () => void;
}

const PasswordEndAdornment = ({ showPassword, setShowPassword }: props) => {
  return (
    <InputAdornment position='end'>
      <IconButton
        aria-label='toggle password visibility'
        edge='end'
        onClick={setShowPassword}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
};

export default PasswordEndAdornment;
