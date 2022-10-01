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
} from '@mui/x-data-grid';
import { Product, SupplierProduct } from 'src/models/types';
import SupplierProductEditToolbarCellAction from './SupplierProductEditToolbarCellAction';
import ProductSelectCellAction from '../inventory/ProductSelectCellAction';
import inventoryContext from 'src/context/inventory/inventoryContext';
import {
  convertGridRowToSupplierProduct,
  convertSupplierProductToGridRow,
  getAvailableProducts,
  SupplierProductGridRow,
} from './procurementHelper';
import { toPairs } from 'lodash';
import PositiveNumberEditCellAction from '../inventory/PositiveNumberEditCellAction';

type SupplierProductEditGridProps = {
    supplierProductList: SupplierProduct[];
    updateSupplierProductList: (supplierProductList: SupplierProduct[]) => void;
  };
  
  export default function SupplierProductEditGrid({
    supplierProductList,
    updateSupplierProductList
  }: SupplierProductEditGridProps) {
    const { products } = React.useContext(inventoryContext);
    const [supplierProductGridRows, setSupplierProductGridRows] = React.useState<
      SupplierProductGridRow[]
    >(convertSupplierProductToGridRow(supplierProductList));
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
      {}
    );
  
    const availableProducts = React.useMemo(
      () => getAvailableProducts(supplierProductGridRows, products),
      [supplierProductGridRows, products]
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
      const updatedSupplierProductGridRows = supplierProductGridRows.filter(
        (row) => row.gridId !== id
      );
      setSupplierProductGridRows(updatedSupplierProductGridRows);
      updateSupplierProductList(convertGridRowToSupplierProduct(updatedSupplierProductGridRows));
    };
  
    const handleCancelClick = (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true }
      });
  
      const editedRow = supplierProductGridRows.find((row) => row.gridId === id);
      if (editedRow!.isNew) {
        setSupplierProductGridRows(supplierProductGridRows.filter((row) => row.gridId !== id));
      }
    };
  
    const processRowUpdate = (newRow: SupplierProductGridRow) => {
      const updatedRow = {
        ...newRow,
        rate: isNaN(newRow.rate) ? 0 : newRow.rate,
        product: newRow.product,
        
        isNew: false,
      };
      const updatedSupplierProductGridRows = supplierProductGridRows.map((row) =>
        row.gridId === newRow.gridId ? updatedRow : row
      );
      setSupplierProductGridRows(updatedSupplierProductGridRows);
      updateSupplierProductList(convertGridRowToSupplierProduct(updatedSupplierProductGridRows));
      return updatedRow;
    };
  
    const columns: GridColumns = [
      {
        field: 'product',
        headerName: 'Product Name',
        flex: 2,
        editable: true,
        // valueGetter: (params: GridValueGetterParams) => params.row.product.name,
        valueFormatter: (params) => params.value.name,
        renderEditCell: (params: GridRenderEditCellParams<Product>) => (
          <ProductSelectCellAction
            params={params}
            allProducts={products}
            availableProducts={availableProducts}
          />
        )
      },
      {
        field: 'rate',
        headerName: 'Rate',
        type: 'number',
        flex: 1,
        editable: true,
        valueFormatter: (params) => params.value.toFixed(2),
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
        rows={supplierProductGridRows}
        columns={columns}
        editMode='row'
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        getRowId={(row) => row.gridId}
        components={{
          Toolbar: SupplierProductEditToolbarCellAction
        }}
        componentsProps={{
          toolbar: {
            setRows: setSupplierProductGridRows,
            setRowModesModel,
            availableProducts,
            disableAdd: supplierProductGridRows.some((row) => row.isNew)
          }
        }}
        experimentalFeatures={{ newEditingApi: true }}
        autoHeight
        pageSize={10}
      />
    );
  }
  