import { TextField } from '@mui/material';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import React from 'react';

type PositiveNonZeroNumberEditCellActionProps = {
  params: GridRenderEditCellParams<number>;
  allowDecimals?: boolean;
};

const PositiveNonZeroNumberEditCellAction = ({
  params,
  allowDecimals = true
}: PositiveNonZeroNumberEditCellActionProps) => {
  const { id: gridId, field, value } = params;

  const apiRef = useGridApiContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      
    let newValue = allowDecimals
      ? Number.parseFloat(e.target.value).toFixed(2)
      : parseInt(e.target.value);
      
      if (e.target.value === '0') newValue = 1;
    
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
  prevProps: Readonly<PositiveNonZeroNumberEditCellActionProps>,
  nextProps: Readonly<PositiveNonZeroNumberEditCellActionProps>
) => {
  const { id: prevId, value: prevValue } = prevProps.params;
  const { id: nextId, value: nextValue } = nextProps.params;
  return prevId === nextId && prevValue === nextValue;
};

export default React.memo(PositiveNonZeroNumberEditCellAction, arePropsSame);
