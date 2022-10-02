import { TextField } from '@mui/material';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import React from 'react';

type PositiveNonZeroNumberEditCellActionProps = {
  params: GridRenderEditCellParams<number>;
};

const PositiveNonZeroNumberEditCellAction = ({
  params
}: PositiveNonZeroNumberEditCellActionProps) => {
  const { id: gridId, field, value } = params;

  const apiRef = useGridApiContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);

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
        inputMode: 'numeric',
        min: 1
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
