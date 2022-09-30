import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Grid,
  TextField,
  ListItemText,
  Typography
} from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowModes, GridRowModesModel } from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import React from 'react';
import { Product, BundleProduct } from '../../models/types';
import { getAllProducts } from '../../services/productService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import '../../styles/pages/procurement.scss';
import TimeoutAlert, { AlertType } from '../common/TimeoutAlert';
import { BundleProductGridRow } from './inventoryHelper';

type BundleProductModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (
    selectedProducts: Product[] | undefined
  ) => void;
  title: string;
  focusPassthrough?: boolean;
  addedProductsId: number[];

  setRows: (
    newRows: (oldRows: BundleProductGridRow[]) => BundleProductGridRow[]
  ) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  availableProducts: Product[];
  disableAdd: boolean;
}

const BundleProductModal = ({
  open,
  onClose,
  onConfirm,
  title,
  focusPassthrough = false,
  addedProductsId,
  
  setRows,
  setRowModesModel,
  availableProducts,
  disableAdd
}: BundleProductModalProps) => {
  const [sku, setSku] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState<string>('');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>();
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [selectionModel, setSelectionModel] = React.useState([]);

  const [tableLoading, setTableLoading] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    setAlert(null);
    asyncFetchCallback(getAllProducts(), (res) =>
      setProducts(res.filter((item) => !addedProductsId.includes(item.id)))
    );
  }, [open, onClose, addedProductsId]);

  const onCancelHandler = () => {
    setSku('');

    onClose();
  };

  const submitHandler = (
    selectedProducts: Product[] | undefined
  ) => {
    onConfirm(selectedProducts);
  };

  const columns: GridColDef[] = [
    { field: 'sku', headerName: 'SKU', flex: 1 },
    { field: 'name', headerName: 'Product Name', flex: 1 },
  ];

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth='sm'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <div className='modal-alert'>
          {alert && (
            <TimeoutAlert
              alert={alert}
              timeout={6000}
              clearAlert={() => setAlert(null)}
            />
          )}
        </div>
        <Box component='form'>
          <DataGrid
            checkboxSelection
            onSelectionModelChange = {(id) => {
              const selectedIDs = new Set(id);
              const selectedRowData = products.filter((row) =>
                selectedIDs.has(row.id)
              );
              console.log("checkbox selection products_selectedRowData", selectedRowData);

              setSelectedProducts(selectedRowData);
              console.log("checkbox selection products_selectedProducts", selectedProducts);
            }}
            columns={columns}
            rows={products}
            getRowId={(row) => row.id}
            loading={tableLoading}
            autoHeight
            pageSize={10}
          />
        </Box>
        <DialogActions>
            <Button onClick={onCancelHandler} autoFocus={!focusPassthrough}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                submitHandler(selectedProducts)
              }
              autoFocus={focusPassthrough}
            >
              Confirm
            </Button>
          </DialogActions>
      </Dialog>
    </div>
  );

}

export default BundleProductModal;