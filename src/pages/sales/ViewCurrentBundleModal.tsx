import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField
} from '@mui/material';
import React, { useState } from 'react';
import { Product, SalesOrderBundleItem } from 'src/models/types';
import '../../styles/pages/sales/orders.scss';
import '../../styles/common/common.scss';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

type ViewCurrentBundleModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
  focusPassthrough?: boolean;
  editSalesOrderBundleItems?: SalesOrderBundleItem[];
  availProducts: Product[];
  updateNewSalesOrderBundleItem: (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => void;
  addNewItemToBundleItems: () => void;
  removeItemFromBundleItems: (productName: String) => void;
};

const ViewCurrentBundleModal = ({
  open,
  onClose,
  title,
  body,
  focusPassthrough = false,
  availProducts,
  editSalesOrderBundleItems,
  updateNewSalesOrderBundleItem,
  addNewItemToBundleItems,
  removeItemFromBundleItems
}: ViewCurrentBundleModalProps) => {
  const [prodName, setProdName] = useState<String>('');
  const [quantity, setQuantity] = useState<number>(0);

  const columns: GridColDef[] = [
    { field: 'productName', headerName: 'Product Name', flex: 1 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        if (params.row.isNewAdded) {
          return (
            <>
              <Button
                variant='contained'
                size='medium'
                onClick={() =>
                  removeItemFromBundleItems(params.row.productName)
                }
              >
                Remove Item
              </Button>
            </>
          );
        }
      }
    }
  ];

  return (
    <>
      <div>
        <form>
          <Dialog
            open={open}
            onClose={onClose}
            maxWidth='md'
            fullWidth={true}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                {body}
              </DialogContentText>

              <DataGrid
                columns={columns}
                rows={editSalesOrderBundleItems!}
                getRowId={(row) => editSalesOrderBundleItems?.indexOf(row)!}
                autoHeight
              />
              <div style={{ margin: '1%' }}>
                <DialogContentText id='alert-dialog-description' style={{margin: '.5%'}}>
                  Add new products into the bundle here.
                </DialogContentText>
                <TextField
                  required
                  fullWidth
                  id='outlined-field'
                  select
                  label='Product'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.value) {
                      updateNewSalesOrderBundleItem(e, 'productName');
                      setProdName(e.target.value);
                    }
                  }}
                >
                  {availProducts.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  autoFocus
                  margin='dense'
                  id='outlined-number'
                  label='Quantity'
                  type='number'
                  fullWidth
                  variant='standard'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.value) {
                      updateNewSalesOrderBundleItem(e, 'quantity');
                      setQuantity(e.target.valueAsNumber);
                    }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <Button
                  disabled={!prodName || quantity <= 0}
                  autoFocus={!focusPassthrough}
                  onClick={() => {
                    addNewItemToBundleItems();
                    setProdName('');
                    setQuantity(0);
                  }}
                >
                  Add Product
                </Button>
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus={!focusPassthrough} onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' autoFocus={focusPassthrough}>
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </div>
    </>
  );
};

export default ViewCurrentBundleModal;
