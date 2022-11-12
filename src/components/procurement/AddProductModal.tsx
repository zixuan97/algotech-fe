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
import {
  Product,
  Supplier,
  SupplierProduct,
  SupplierProductInfo
} from 'src/models/types';
import { getAllProducts } from 'src/services/productService';
import {
  getAllSupplierProducts,
  getSupplierById
} from 'src/services/supplierService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import '../../styles/pages/procurement.scss';
import TimeoutAlert, { AlertType } from '../common/TimeoutAlert';

type AddProductModalProps = {
  suppliers: Supplier[];
  productIdToDisplay: number | undefined;
  open: boolean;
  onClose: () => void;
  onConfirm: (
    rate: string,
    quantity: string,
    selectedProduct: Product | undefined,
    supplierId: string | undefined
  ) => void;
  title: string;
  focusPassthrough?: boolean;
  addedProductsId: number[];
  selectedSupplierId: number | undefined;
};

const AddProductModal = ({
  suppliers,
  productIdToDisplay,
  open,
  onClose,
  onConfirm,
  title,
  focusPassthrough = false,
  addedProductsId,
  selectedSupplierId
}: AddProductModalProps) => {
  const [sku, setSku] = React.useState<string>('');
  const [rate, setRate] = React.useState<string>('');
  const [supplierId, setSupplierId] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState<string>('');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedSupplierProducts, setSelectedSupplierProducts] =
    React.useState<SupplierProduct[]>([]);
  const [allSupplierProducts, setAllSupplierProducts] = React.useState<
    SupplierProductInfo[]
  >([]);
  const [selectedProduct, setSelectedProduct] =
    React.useState<Product | null>();
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const onSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSku(e.target.value);
    setSelectedProduct(products.find((item) => item.sku === e.target.value));
  };

  const onSkuChangeWithFixedRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedSupplierProduct = selectedSupplierProducts.find(
      (item) => item.product.sku === e.target.value
    );
    setSku(e.target.value);
    setSelectedProduct(selectedSupplierProduct!.product);
    setRate(selectedSupplierProduct!.rate.toString());
  };

  const onRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedSupplierProduct = allSupplierProducts.find(
      (supplierProduct) =>
        supplierProduct.productId == selectedProduct?.id &&
        supplierProduct.supplierId.toString() == e.target.value
    );
    setRate(selectedSupplierProduct!.rate.toString());
    setSupplierId(e.target.value);
  };

  const onCancelHandler = () => {
    setSku('');
    setRate('');
    setSelectedProduct(null);
    setSupplierId('');
    setQuantity('');

    onClose();
  };

  const submitHandler = (
    sku: string,
    rate: string,
    quantity: string,
    selectedProduct: Product | undefined,
    supplierId: string | undefined
  ) => {
    if (sku === '' || undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please Enter a SKU!'
      });
      return;
    }

    if (rate === '' || undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please Select a Rate!'
      });
      return;
    }

    if (parseInt(quantity) <= 0) {
      setAlert({
        severity: 'warning',
        message: 'Please Enter a valid Quantity!'
      });
      return;
    }

    if (quantity === '' || undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please Enter a Quantity!'
      });
      return;
    }

    onConfirm(rate, quantity, selectedProduct, supplierId);

    setSku('');
    setRate('');
    setSupplierId('');
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

    if (selectedSupplierId) {
      asyncFetchCallback(getSupplierById(selectedSupplierId), (res) =>
        setSelectedSupplierProducts(
          res['supplierProduct'].filter(
            (item) => !addedProductsId.includes(item.product.id)
          )
        )
      );
    } else {
      asyncFetchCallback(getAllProducts(), (res) =>
        setProducts(res.filter((item) => !addedProductsId.includes(item.id)))
      );
      asyncFetchCallback(getAllSupplierProducts(), (res) =>
        setAllSupplierProducts(res)
      );
    }
  }, [open, onClose, addedProductsId, productIdToDisplay, selectedSupplierId]);

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
                {!selectedSupplierId ? (
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
                ) : (
                  <TextField
                    id='outlined-required'
                    label='SKU'
                    name='sku'
                    value={sku}
                    onChange={onSkuChangeWithFixedRate}
                    select
                    required
                    fullWidth
                  >
                    {selectedSupplierProducts.map((option) => (
                      <MenuItem
                        key={option.product.id}
                        value={option.product.sku}
                      >
                        <ListItemText inset>
                          SKU: {option.product.sku}
                        </ListItemText>
                        <Typography variant='subtitle1' color='text.secondary'>
                          Product Name: {option.product.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Grid>
              <Grid item>
                {!selectedSupplierId ? (
                  <TextField
                    id='outlined-required'
                    label='Rate per Unit'
                    name='rate'
                    value={supplierId}
                    onChange={onRateChange}
                    select
                    required
                    fullWidth
                  >
                    {allSupplierProducts
                      .filter(
                        (supplierProduct) =>
                          supplierProduct.productId === selectedProduct?.id
                      )
                      .map((option) => (
                        <MenuItem
                          key={option.supplierId}
                          value={option.supplierId}
                        >
                          <ListItemText inset>
                            Supplier ID: {option.supplierId}
                          </ListItemText>
                          <Typography
                            variant='subtitle1'
                            color='text.secondary'
                            style={{ display: 'flex', paddingLeft: '4rem' }}
                          >
                            Rate:{' '}
                            {suppliers.find(
                              (supplier) =>
                                supplier.id.toString() ==
                                option.supplierId.toString()
                            )
                              ? suppliers
                                  .find(
                                    (supplier) =>
                                      supplier.id.toString() ==
                                      option.supplierId.toString()
                                  )!
                                  .currency.split(' - ')[0] + ' '
                              : ''}
                            {option.rate}
                          </Typography>
                        </MenuItem>
                      ))}
                  </TextField>
                ) : (
                  <TextField
                    id='outlined-required'
                    label='Rate per Unit'
                    name='rate'
                    variant='filled'
                    InputLabelProps={{ shrink: true }}
                    value={
                      selectedSupplierProducts.find(
                        (supplierProduct) => supplierProduct.product.sku === sku
                      )?.rate
                    }
                    required
                    disabled
                    fullWidth
                  />
                )}
              </Grid>
              <Grid item>
                <TextField
                  id='outlined-required'
                  label='Purchase Quantity'
                  name='quantity'
                  type='number'
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
            <Button onClick={onCancelHandler} autoFocus={!focusPassthrough}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                submitHandler(sku, rate, quantity, selectedProduct!, supplierId)
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
};

export default AddProductModal;
