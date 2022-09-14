import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormGroup,
  Grid,
  TextField
} from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import '../../styles/pages/procurement.scss';

type AddProductModalPops = {
  open: boolean;
  onClose: () => void;
  onConfirm: (sku: string, rate: string, quantity: string) => void;
  title: string;
  focusPassthrough?: boolean;
};

const AddProductModal = ({
  open,
  onClose,
  onConfirm,
  title,
  focusPassthrough = false
}: AddProductModalPops) => {
  const [sku, setSku] = React.useState<string>('');
  const [rate, setRate] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState<string>('');

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
        <Box component='form'>
          <div className='modal-text-fields'>
            <Grid container direction={'column'} spacing={3}>
              <Grid item>
                <TextField
                  id='outlined-required'
                  label='SKU'
                  name='sku'
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder='Eg. 12345'
                  required
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  id='outlined-required'
                  label='Rate per Unit'
                  name='rate'
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder='Eg. $5'
                  required
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  id='outlined-required'
                  label='Purchase Quantity'
                  name='quantity'
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder='Eg. 1000 units'
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          </div>
          <DialogActions>
            <Button onClick={onClose} autoFocus={!focusPassthrough}>
              Cancel
            </Button>
            <Button
              //   type='submit'
              onClick={() => onConfirm(sku, rate, quantity)}
              autoFocus={focusPassthrough}
            >
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default AddProductModal;
