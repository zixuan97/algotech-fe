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
  GridRenderEditCellParams
} from '@mui/x-data-grid';
import { Location, StockQuantity } from 'src/models/types';
import EditToolbarCellAction from './EditToolbarCellAction';
import LocationSelectCellAction from './LocationSelectCellAction';
import PositiveNumberEditCellAction from './PositiveNumberEditCellAction';
import inventoryContext from 'src/context/inventory/inventoryContext';
import {
  convertGridRowToStockQty,
  convertStockQtyToGridRow,
  getAvailableLocations,
  StockQuantityGridRow
} from './inventoryHelper';
import { toPairs } from 'lodash';

type LocationEditGridProps = {
  stockQuantity: StockQuantity[];
  updateStockQuantity: (stockQuantity: StockQuantity[]) => void;
};

//TODO: create a generic version of Edtiable Grid
export default function LocationEditGrid({
  stockQuantity,
  updateStockQuantity
}: LocationEditGridProps) {
  const { locations } = React.useContext(inventoryContext);
  const [stockQtyGridRows, setStockQtyGridRows] = React.useState<
    StockQuantityGridRow[]
  >(convertStockQtyToGridRow(stockQuantity));
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const availableLocations = React.useMemo(
    () => getAvailableLocations(stockQtyGridRows, locations),
    [stockQtyGridRows, locations]
  );

  const handleRowEditStart = (
    _: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (_, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const updatedStockQtyGridRows = stockQtyGridRows.filter(
      (row) => row.gridId !== id
    );
    setStockQtyGridRows(updatedStockQtyGridRows);
    updateStockQuantity(convertGridRowToStockQty(updatedStockQtyGridRows));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = stockQtyGridRows.find((row) => row.gridId === id);
    if (editedRow!.isNew) {
      setStockQtyGridRows(stockQtyGridRows.filter((row) => row.gridId !== id));
    }
  };

  const processRowUpdate = (newRow: StockQuantityGridRow) => {
    const updatedRow = {
      ...newRow,
      quantity: isNaN(newRow.quantity) ? 0 : newRow.quantity,
      // price: isNaN(newRow.price) ? 0 : newRow.price,
      isNew: false
    };
    const updatedStockQtyGridRows = stockQtyGridRows.map((row) =>
      row.gridId === newRow.gridId ? updatedRow : row
    );
    setStockQtyGridRows(updatedStockQtyGridRows);
    updateStockQuantity(convertGridRowToStockQty(updatedStockQtyGridRows));
    return updatedRow;
  };

  const columns: GridColumns = [
    {
      field: 'location',
      headerName: 'Warehouse Location',
      flex: 2,
      editable: true,
      valueFormatter: (params) => params.value.name,
      renderEditCell: (params: GridRenderEditCellParams<Location>) => (
        <LocationSelectCellAction
          params={params}
          allLocations={locations}
          availableLocations={availableLocations}
        />
      )
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      flex: 1,
      editable: true,
      renderEditCell: (params) => (
        <PositiveNumberEditCellAction params={params} allowDecimals={false} />
      )
    },
    // {
    //   field: 'price',
    //   headerName: 'Price',
    //   type: 'number',
    //   flex: 1,
    //   editable: true,
    //   valueFormatter: (params) => params.value.toFixed(2),
    //   renderEditCell: (params) => (
    //     <PositiveNumberEditCellAction params={params} />
    //   )
    // },
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

        const anyCellEditing = toPairs(rowModesModel).some(
          (row) => row[0] !== id && row[1].mode === GridRowModes.Edit
        );

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            disabled={anyCellEditing}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            disabled={anyCellEditing}
            color='inherit'
          />
        ];
      }
    }
  ];

  return (
    <DataGrid
      rows={stockQtyGridRows}
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
          setRows: setStockQtyGridRows,
          setRowModesModel,
          availableLocations,
          disableAdd: stockQtyGridRows.some((row) => row.isNew)
        }
      }}
      experimentalFeatures={{ newEditingApi: true }}
      autoHeight
      pageSize={10}
    />
  );
}
