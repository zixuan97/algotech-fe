import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem
} from '@mui/material';
import React, { useState } from 'react';
import { Product } from 'src/models/types';
import '../../styles/pages/sales/orders.scss';
import '../../styles/common/common.scss';

type AddSalesOrderItemModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
  focusPassthrough?: boolean;
  addNewSalesOrderItem: () => void;
  availProducts: Product[];
  orderFieldOnChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => void;
};

const AddSalesOrderItemModal = ({
  open,
  onClose,
  title,
  body,
  focusPassthrough = false,
  addNewSalesOrderItem,
  availProducts,
  orderFieldOnChange
}: AddSalesOrderItemModalProps) => {
  const [prodName, setProdName] = useState<String>('');
  const [quantity, setQuantity] = useState<number>(0);

  return (
    <div>
      <form>
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description' style={{marginBottom: '10%'}}>
              {body}
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
                  orderFieldOnChange(e, 'productName');
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
                  orderFieldOnChange(e, 'quantity');
                  setQuantity(e.target.valueAsNumber);
                }
              }}
              InputLabelProps={{
                shrink: true
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} autoFocus={!focusPassthrough}>
              Close
            </Button>
            <Button
              type='submit'
              onClick={() => {
                addNewSalesOrderItem();
                setProdName('');
                setQuantity(0);
              }}
              disabled={!prodName || quantity <= 0}
              autoFocus={focusPassthrough}
            >
              Add Item
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default AddSalesOrderItemModal;
