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
import { Product } from 'src/models/types';
import ProductEditToolbarCellAction from './ProductEditToolbarCellAction';
import ProductSelectCellAction from './ProductSelectCellAction';
import inventoryContext from 'src/context/inventory/inventoryContext';
import {
  convertGridRowToProduct,
  convertProductToGridRow,
  getAvailableProducts,
  ProductGridRow
} from './inventoryHelper';
import { toPairs } from 'lodash';

type ProductEditGridProps = {
  productList: Product[];
  updateProductList: (productList: Product[]) => void;
};

//TODO: create a generic version of Edtiable Grid
export default function ProductEditGrid({
  productList,
  updateProductList
}: ProductEditGridProps) {
  const { products } = React.useContext(inventoryContext);
  const [productGridRows, setProductGridRows] = React.useState<
    ProductGridRow[]
  >(convertProductToGridRow(productList));
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const availableProducts = React.useMemo(
    () => getAvailableProducts(productGridRows, products),
    [productGridRows, products]
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
    const updatedProductGridRows = productGridRows.filter(
      (row) => row.gridId !== id
    );
    setProductGridRows(updatedProductGridRows);
    updateProductList(convertGridRowToProduct(updatedProductGridRows));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = productGridRows.find((row) => row.gridId === id);
    if (editedRow!.isNew) {
      setProductGridRows(productGridRows.filter((row) => row.gridId !== id));
    }
  };

  const processRowUpdate = (newRow: ProductGridRow) => {
    const updatedRow = {
      ...newRow,
      isNew: false
    };
    const updatedProductGridRows = productGridRows.map((row) =>
      row.gridId === newRow.gridId ? updatedRow : row
    );
    setProductGridRows(updatedProductGridRows);
    updateProductList(convertGridRowToProduct(updatedProductGridRows));
    return updatedRow;
  };

  const columns: GridColumns = [
    {
      field: 'name',
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
      rows={productGridRows}
      columns={columns}
      editMode='row'
      rowModesModel={rowModesModel}
      onRowEditStart={handleRowEditStart}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      getRowId={(row) => row.gridId}
      components={{
        Toolbar: ProductEditToolbarCellAction
      }}
      componentsProps={{
        toolbar: {
          setRows: setProductGridRows,
          setRowModesModel,
          availableProducts,
          disableAdd: productGridRows.some((row) => row.isNew)
        }
      }}
      experimentalFeatures={{ newEditingApi: true }}
      autoHeight
      pageSize={10}
    />
  );
}
