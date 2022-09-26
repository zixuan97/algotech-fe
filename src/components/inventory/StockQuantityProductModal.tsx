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
import React from 'react';
import { Product, StockQuantity } from '../../models/types';
import { getAllProducts } from '../../services/productService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import '../../styles/pages/procurement.scss';
import TimeoutAlert, { AlertType } from '../common/TimeoutAlert';

type StockQuantityProductModalProps = {
  productIdToDisplay: number | undefined;
  open: boolean;
  onClose: () => void;
  onConfirm: (
    quantity: string,
    selectedProduct: Product | undefined
  ) => void;
  title: string;
  focusPassthrough?: boolean;
  addedProductsId: number[];
};

const StockQuantityProductModal = ({
  productIdToDisplay,
  open,
  onClose,
  onConfirm,
  title,
  focusPassthrough = false,
  addedProductsId
}: StockQuantityProductModalProps) => {
  const [sku, setSku] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState<string>('');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product>();
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const onSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSku(e.target.value);
    setSelectedProduct(products.find((item) => item.sku === e.target.value));
  };

  const onCancelHandler = () => {
    setSku('');
    setQuantity('');

    onClose();
  };

  const submitHandler = (
    sku: string,
    quantity: string,
    selectedProduct: Product | undefined
  ) => {
    if (sku === '' || undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please enter an SKU!'
      });
      return;
    }
    if (parseInt(quantity) <= 0) {
      setAlert({
        severity: 'warning',
        message: 'Please enter a valid quantity!'
      });
      return;
    }

    if (quantity === '' || undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please enter a quantity!'
      });
      return;
    }

    onConfirm(quantity, selectedProduct);
    setSku('');
    setQuantity('');
  };

  React.useEffect(() => {
    if (productIdToDisplay) {
      let product = products.find((item) => item.id === productIdToDisplay);
      if (product) {
        setSku(product.sku);
        setSelectedProduct(product);
      }
    }
    setAlert(null);
    asyncFetchCallback(getAllProducts(), (res) =>
      setProducts(res.filter((item) => !addedProductsId.includes(item.id)))
    );
  }, [open, onClose, addedProductsId, productIdToDisplay]);

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
          <div className='modal-text-fields'>
            <Grid container direction={'column'} spacing={3}>
              <Grid item>
                <TextField
                  id='outlined-required'
                  label='SKU'
                  name='sku'
                  value={sku}
                  onChange={onSkuChange}
                  select
                  required
                  fullWidth
                >
                  {products.map((option) => (
                    <MenuItem key={option.id} value={option.sku}>
                      <ListItemText inset>SKU: {option.sku}</ListItemText>
                      <Typography variant='subtitle1' color='text.secondary'>
                        Product Name: {option.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  id='outlined-required'
                  label='Remaining Quantity'
                  name='quantity'
                  type='number'
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder='Eg. 1000'
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          </div>
          <DialogActions>
            <Button onClick={onCancelHandler} autoFocus={!focusPassthrough}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                submitHandler(sku, quantity, selectedProduct)
              }
              autoFocus={focusPassthrough}
            >
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );

}

export default StockQuantityProductModal;