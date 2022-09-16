import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRenderEditCellParams,
  GridValueFormatterParams,
  GridPreProcessEditCellProps,
  GridValueSetterParams,
  useGridApiContext
} from '@mui/x-data-grid';
import { Location } from 'src/models/types';
import { ProductLocationRow } from 'src/pages/inventory/CreateProduct';
import EditToolbarCellAction from './EditToolbarCellAction';
import LocationSelectCellAction from './LocationSelectCellAction';
import { TextField } from '@mui/material';
import PositiveNumberEditCellAction from './PositiveNumberEditCellAction';

type LocationGridProps = {
  locations: Location[];
  productLocations: ProductLocationRow[];
  updateProductLocations: (productLocations: ProductLocationRow[]) => void;
};

//TODO: create a generic version of Edtiable Grid
export default function LocationGrid({
  locations,
  productLocations,
  updateProductLocations
}: LocationGridProps) {
  const availableLocations = React.useMemo(
    () =>
      locations.filter(
        (location) =>
          !productLocations.find(
            (prodLocation) => prodLocation.id === location.id
          )
      ),
    [locations, productLocations]
  );
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const handleRowEditStart = (
    _: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    updateProductLocations(productLocations.filter((row) => row.gridId !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = productLocations.find((row) => row.gridId === id);
    if (editedRow!.isNew) {
      updateProductLocations(
        productLocations.filter((row) => row.gridId !== id)
      );
    }
  };

  const processRowUpdate = (newRow: ProductLocationRow) => {
    console.log(newRow);
    const updatedRow = {
      ...newRow,
      name: availableLocations.find((location) => location.id === newRow.id)
        ?.name!,
      quantity: isNaN(newRow.quantity) ? 0 : newRow.quantity,
      price: isNaN(newRow.price) ? 0 : newRow.price,
      isNew: false
    };
    updateProductLocations(
      productLocations.map((row) =>
        row.gridId === newRow.gridId ? updatedRow : row
      )
    );
    return updatedRow;
  };

  const columns: GridColumns = [
    {
      field: 'id',
      headerName: 'Warehouse Location',
      flex: 2,
      editable: true,
      valueFormatter: (params: GridValueFormatterParams) => {
        return locations.find((location) => location.id === params.value)?.name;
      },
      renderEditCell: (params: GridRenderEditCellParams<number>) => (
        <LocationSelectCellAction params={params} locations={locations} />
      )
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      flex: 1,
      editable: true,
      //   preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      //     const { props, hasChanged } = params;
      //     const hasError = hasChanged && props.value < 0;
      //     return {
      //       ...props,
      //       error: hasError
      //     };
      //   },
      renderEditCell: (params) => (
        <PositiveNumberEditCellAction params={params} allowDecimals={false} />
      )
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      flex: 1,
      editable: true,
      renderEditCell: (params) => (
        <PositiveNumberEditCellAction params={params} />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
          />
        ];
      }
    }
  ];

  return (
    <DataGrid
      rows={productLocations}
      columns={columns}
      editMode='row'
      rowModesModel={rowModesModel}
      onRowEditStart={handleRowEditStart}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      getRowId={(row) => row.gridId}
      components={{
        Toolbar: EditToolbarCellAction
      }}
      componentsProps={{
        toolbar: {
          setRows: updateProductLocations,
          setRowModesModel,
          locations
        }
      }}
      experimentalFeatures={{ newEditingApi: true }}
      autoHeight
      pageSize={10}
    />
  );
}
