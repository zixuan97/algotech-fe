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
import React, { useEffect, useRef, useState } from 'react';
import {
  OrderStatus,
  Product,
  SalesOrder,
  SalesOrderBundleItem
} from 'src/models/types';
import '../../styles/pages/sales/orders.scss';
import '../../styles/common/common.scss';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';

type ViewCurrentBundleModalProps = {
  open: boolean;
  onClose: () => void;
  focusPassthrough?: boolean;
  editSalesOrderBundleItems: SalesOrderBundleItem[];
  availProducts: Product[];
  updateNewSalesOrderBundleItem: (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => void;
  addNewItemToBundleItems: () => void;
  removeItemFromBundleItems: (
    productName: String,
    salesOrderItemId: number,
    idx: number
  ) => void;
  onSave: () => void;
  salesOrder: SalesOrder;
};

const ViewCurrentBundleModal = ({
  open,
  onClose,
  focusPassthrough = false,
  availProducts,
  editSalesOrderBundleItems,
  updateNewSalesOrderBundleItem,
  addNewItemToBundleItems,
  removeItemFromBundleItems,
  onSave,
  salesOrder
}: ViewCurrentBundleModalProps) => {
  const [prodName, setProdName] = useState<String>('');
  const [quantity, setQuantity] = useState<String>('');
  const [bundleAlert, setBundleAlert] = useState<AlertType | null>(null);
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
        return (
          <>
            {salesOrder.orderStatus === OrderStatus.PREPARING && (
              <Button
                variant='contained'
                size='medium'
                onClick={() => {
                  removeItemFromBundleItems(
                    params.row.productName,
                    params.row.salesOrderItemId,
                    params.row.id
                  );
                }}
              >
                Remove Item
              </Button>
            )}
          </>
        );
      }
    }
  ];

  useEffect(() => {
    if (editSalesOrderBundleItems?.length! < 1) {
      setBundleAlert({
        severity: 'info',
        message: `Note: Bundle cannot be empty. If so, please ensure that there are items in this bundle.`
      });
    }
  }, [editSalesOrderBundleItems]);

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
            <DialogTitle id='alert-dialog-title'>
              Items in the bundle.
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                These are the items in your bundle.
              </DialogContentText>

              <TimeoutAlert
                alert={bundleAlert}
                clearAlert={() => setBundleAlert(null)}
              />
              <DataGrid
                columns={columns}
                rows={editSalesOrderBundleItems!}
                getRowId={(row) => editSalesOrderBundleItems?.indexOf(row)!}
                autoHeight
              />
              {salesOrder && salesOrder.orderStatus === OrderStatus.PREPARING && (
                <div style={{ margin: '1%' }}>
                  <DialogContentText
                    id='alert-dialog-description'
                    style={{ margin: '.5%' }}
                  >
                    Add new products into the bundle here.
                  </DialogContentText>
                  <TextField
                    required
                    fullWidth
                    id='outlined-field'
                    select
                    label='Product'
                    value={prodName}
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
                    value={quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.value) {
                        updateNewSalesOrderBundleItem(e, 'quantity');
                        setQuantity(e.target.value);
                      }
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <Button
                    disabled={!prodName || !quantity}
                    autoFocus={!focusPassthrough}
                    onClick={() => {
                      addNewItemToBundleItems();
                      setProdName('');
                      setQuantity('');
                    }}
                  >
                    Add Product
                  </Button>
                </div>
              )}
            </DialogContent>
            {salesOrder && salesOrder.orderStatus === OrderStatus.PREPARING && (
              <DialogActions>
                <Button autoFocus={!focusPassthrough} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type='submit'
                  autoFocus={focusPassthrough}
                  onClick={onSave}
                  disabled={editSalesOrderBundleItems?.length! < 1}
                >
                  Save Changes
                </Button>
              </DialogActions>
            )}
          </Dialog>
        </form>
      </div>
    </>
  );
};

export default ViewCurrentBundleModal;
