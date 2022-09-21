import { TextField } from '@mui/material';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import React from 'react';

type PositiveNumberEditCellActionProps = {
  params: GridRenderEditCellParams<number>;
  allowDecimals?: boolean;
};

const PositiveNumberEditCellAction = ({
  params,
  allowDecimals = true
}: PositiveNumberEditCellActionProps) => {
  const { id: gridId, field, value } = params;

  const apiRef = useGridApiContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = allowDecimals
      ? Number.parseFloat(e.target.value).toFixed(2)
      : parseInt(e.target.value);
    apiRef.current.setEditCellValue({
      id: gridId,
      field,
      value: newValue
    });
  };

  return (
    <TextField
      type='number'
      size='small'
      value={value}
      onChange={handleChange}
      inputProps={{
        inputMode: allowDecimals ? 'decimal' : 'numeric',
        min: '0'
      }}
    />
  );
};

const arePropsSame = (
  prevProps: Readonly<PositiveNumberEditCellActionProps>,
  nextProps: Readonly<PositiveNumberEditCellActionProps>
) => {
  const { id: prevId, value: prevValue } = prevProps.params;
  const { id: nextId, value: nextValue } = nextProps.params;
  return prevId === nextId && prevValue === nextValue;
};

export default React.memo(PositiveNumberEditCellAction, arePropsSame);
