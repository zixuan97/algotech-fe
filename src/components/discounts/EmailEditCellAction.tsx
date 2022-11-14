import { TextField } from '@mui/material';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import React from 'react';

type EmailEditCellActionProps = {
  params: GridRenderEditCellParams<string>;
};

const EmailEditCellAction = ({ params }: EmailEditCellActionProps) => {
  const { id: gridId, field, value } = params;

  const apiRef = useGridApiContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    apiRef.current.setEditCellValue({
      id: gridId,
      field,
      value: e.target.value
    });
  };

  return (
    <TextField fullWidth size='small' value={value} onChange={handleChange} />
  );
};

export default React.memo(EmailEditCellAction);
