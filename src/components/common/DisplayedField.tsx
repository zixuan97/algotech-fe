import { Typography } from '@mui/material';
import React from 'react';

type DisplayedFieldProps = {
  label: string;
  value: string;
};

const DisplayedField = ({ label, value }: DisplayedFieldProps) => {
  return (
    <div
      style={{
        flexDirection: 'column',
        padding: '2rem',
        paddingBottom: '0'
      }}
    >
      <Typography variant='h2' sx={{ padding: '10px' }}>
        {label}
      </Typography>
      <Typography sx={{ padding: '10px' }}>{value}</Typography>
    </div>
  );
};

export default DisplayedField;
