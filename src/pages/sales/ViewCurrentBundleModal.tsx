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
import React, { useEffect, useState } from 'react';
import { Product, SalesOrderBundleItem } from 'src/models/types';
// import { AdditionalSalesOrderItem } from './SalesOrderDetails';
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
};

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
            <Button variant='contained' size='medium'>
              Remove Item
            </Button>
            <Button variant='contained' size='medium'>
              Edit item
            </Button>
          </>
        );
      }
    }
  }
];

const ViewCurrentBundleModal = ({
  open,
  onClose,
  title,
  body,
  focusPassthrough = false,
  availProducts,
  editSalesOrderBundleItems
}: ViewCurrentBundleModalProps) => {
  const [editedSalesOrderBundleItems, setEditedSalesOrderBundleItems] =
    useState<SalesOrderBundleItem[]>(editSalesOrderBundleItems!);
  const [availableProds, setAvailableProds] = useState<Product[]>(
    availProducts!
  );
  const [newSalesOrderBundleItem, setNewSalesOrderBundleItem] =
    useState<SalesOrderBundleItem>();

  const orderFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setNewSalesOrderBundleItem((bundleItem) => {
      return {
        ...bundleItem!,
        [key]:
          key === 'quantity' ? event.target.valueAsNumber : event.target.value,
        isNewAdded: true
      };
    });
  };

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
                rows={editedSalesOrderBundleItems!}
                autoHeight
              />
              <Button autoFocus={!focusPassthrough}>Add Product</Button>
              <TextField
                required
                id='outlined-field'
                select
                label='Product'
                value={newSalesOrderBundleItem}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value) {
                    orderFieldOnChange(e, 'productName');
                  }
                }}
              >
                {availableProds.map((option) => (
                  <MenuItem key={option.id} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button autoFocus={!focusPassthrough} onClick={onClose}>
                Close
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
