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
import { Product, BundleProduct } from 'src/models/types';
import BundleProductEditToolbarCellAction from './BundleProductEditToolbarCellAction';
import ProductSelectCellAction from './ProductSelectCellAction';
import inventoryContext from 'src/context/inventory/inventoryContext';
import {
  convertGridRowToBundleProduct,
  convertBundleProductToGridRow,
  getAvailableProducts,
  BundleProductGridRow
} from './inventoryHelper';
import { toPairs } from 'lodash';
import PositiveNonZeroNumberEditCellAction from './PositiveNonZeroNumberEditCellAction';

type BundleProductEditGridProps = {
  bundleProductList: BundleProduct[];
  updateBundleProductList: (bundleProductList: BundleProduct[]) => void;
};

export default function BundleProductEditGrid({
  bundleProductList,
  updateBundleProductList
}: BundleProductEditGridProps) {
  const { products } = React.useContext(inventoryContext);
  const [bundleProductGridRows, setBundleProductGridRows] = React.useState<
    BundleProductGridRow[]
  >(convertBundleProductToGridRow(bundleProductList));
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const availableProducts = React.useMemo(
    () => getAvailableProducts(bundleProductGridRows, products),
    [bundleProductGridRows, products]
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
    const updatedBundleProductGridRows = bundleProductGridRows.filter(
      (row) => row.gridId !== id
    );
    setBundleProductGridRows(updatedBundleProductGridRows);
    updateBundleProductList(
      convertGridRowToBundleProduct(updatedBundleProductGridRows)
    );
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = bundleProductGridRows.find((row) => row.gridId === id);
    if (editedRow!.isNew) {
      setBundleProductGridRows(
        bundleProductGridRows.filter((row) => row.gridId !== id)
      );
    }
  };

  const processRowUpdate = (newRow: BundleProductGridRow) => {
    const updatedRow = {
      ...newRow,
      quantity: isNaN(newRow.quantity) ? 0 : newRow.quantity,
      product: newRow.product,
      productId: newRow.product.id,

      isNew: false
    };
    const updatedBundleProductGridRows = bundleProductGridRows.map((row) =>
      row.gridId === newRow.gridId ? updatedRow : row
    );
    setBundleProductGridRows(updatedBundleProductGridRows);
    updateBundleProductList(
      convertGridRowToBundleProduct(updatedBundleProductGridRows)
    );
    return updatedRow;
  };

  const columns: GridColumns = [
    {
      field: 'product',
      headerName: 'Product Name',
      flex: 2,
      editable: true,
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
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      flex: 1,
      editable: true,
      renderEditCell: (params) => (
        <PositiveNonZeroNumberEditCellAction params={params} />
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
      rows={bundleProductGridRows}
      columns={columns}
      editMode='row'
      rowModesModel={rowModesModel}
      onRowEditStart={handleRowEditStart}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      getRowId={(row) => row.gridId}
      components={{
        Toolbar: BundleProductEditToolbarCellAction
      }}
      componentsProps={{
        toolbar: {
          setRows: setBundleProductGridRows,
          setRowModesModel,
          availableProducts,
          disableAdd: bundleProductGridRows.some((row) => row.isNew)
        }
      }}
      experimentalFeatures={{ newEditingApi: true }}
      autoHeight
      pageSize={10}
    />
  );
}
