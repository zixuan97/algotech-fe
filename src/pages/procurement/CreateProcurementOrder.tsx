import React from 'react';
import { useNavigate } from 'react-router';
import {
  FormGroup,
  Tooltip,
  IconButton,
  Paper,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Grid
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { ProcurementOrder, Supplier, Location } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  createProcurementOrder,
  getAllSuppliers
} from 'src/services/procurementService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddProductModal from 'src/components/procurement/AddProductModal';
import '../../styles/pages/procurement.scss';
import { getProductBySku } from 'src/services/productService';
import { ProcurementOrderItem } from 'src/models/types';
import { AlertType } from 'src/components/common/TimeoutAlert';
import { getAllLocations } from 'src/services/locationService';
import { toast } from 'react-toastify';

const columns: GridColDef[] = [
  { field: 'product_sku', headerName: 'SKU', flex: 1 },
  { field: 'product_name', headerName: 'Product Name', flex: 1 },
  { field: 'rate', headerName: 'Rate per Unit', flex: 1 },
  { field: 'quantity', headerName: 'Quantity', flex: 1 }
];

export type NewProcurementOrder = Partial<ProcurementOrder> & {};
type NewProcurementOrderItem = Partial<ProcurementOrderItem>;

const CreateProcurementOrder = () => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newProcurementOrder, setNewProcurementOrder] =
    React.useState<NewProcurementOrder>({});
  const [orderItems, setOrderItems] = React.useState<NewProcurementOrderItem[]>(
    []
  );
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [warehouseData, setWarehouseData] = React.useState<Location[]>([]);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [openFailure, setOpenFailure] = React.useState(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  React.useEffect(() => {
    asyncFetchCallback(getAllSuppliers(), setSuppliers);
    asyncFetchCallback(getAllLocations(), setWarehouseData);
  }, []);

  const handleEditProcurementOrder = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await setNewProcurementOrder((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleAddOrderItem = async (
    sku: string,
    rate: string,
    quantity: string
  ) => {
    console.log(sku);
    await asyncFetchCallback(
      getProductBySku(sku),
      (res) => {
        let newProcurementOrderItem: NewProcurementOrderItem = {
          id: res.id,
          quantity: parseInt(quantity),
          product_sku: sku,
          rate: parseInt(rate),
          product_name: res.name
        };
        let updatedOrderItems = Object.assign([], orderItems);
        updatedOrderItems.push(newProcurementOrderItem);
        setOrderItems(updatedOrderItems);
        setModalOpen(false);
        setOpenSuccess(true);
      },
      (err) => {
        setOpenFailure(true);
      }
    );
  };

  const handleSuccessClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
  };

  const handleFailureClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenFailure(false);
  };

  const handleWarningClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenWarning(false);
  };

  const handleOrderCreation = async () => {
    if (newProcurementOrder.supplier_id === undefined) {
      setOpenWarning(true);
      setAlert({
        severity: 'warning',
        message: 'Please Select a Supplier!'
      });
      return;
    }

    if (newProcurementOrder.description === undefined) {
      setOpenWarning(true);
      setAlert({
        severity: 'warning',
        message: 'Please Enter a Description!'
      });
      return;
    }

    if (newProcurementOrder.warehouse_address === undefined) {
      setOpenWarning(true);
      setAlert({
        severity: 'warning',
        message: 'Please Select a Warehouse Address!'
      });
      return;
    }

    if (orderItems.length === 0) {
      setOpenWarning(true);
      setAlert({
        severity: 'warning',
        message: 'Please Add Order Items!'
      });
      return;
    }

    setLoading(true);
    let finalProcurementOrderItems = orderItems.map(
      ({ product_sku, quantity, product_name, rate }) => ({
        product_sku,
        quantity,
        product_name,
        rate
      })
    );

    let reqBody = {
      description: newProcurementOrder.description,
      payment_status: 'PENDING',
      fulfilment_status: 'CREATED',
      proc_order_items: finalProcurementOrderItems,
      supplier_id: newProcurementOrder.supplier_id,
      warehouse_address: newProcurementOrder.warehouse_address
    };

    await asyncFetchCallback(
      createProcurementOrder(reqBody),
      (res) => {
        setLoading(false);
        toast.success(
          'Procurement Order created! A confirmation email has been sent to the supplier.',
          {
            position: 'top-right',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          }
        );
        navigate('/orders');
      },
      (err) => {
        setLoading(false);
        setOpenFailure(true);
        setAlert({
          severity: 'error',
          message:
            'Procurement Order was not created successfully, please try again!'
        });
      }
    );
  };

  return (
    <div className='create-procurement-order'>
      <div className='create-procurement-order-heading'>
        <Tooltip title='Return to Previous Page' enterDelay={300}>
          <IconButton size='large' onClick={() => navigate(-1)}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <h1>Create Procurement Order</h1>
      </div>
      <div className='alert'>
        <Snackbar
          open={openWarning}
          autoHideDuration={6000}
          onClose={handleWarningClose}
        >
          <Alert
            onClose={handleWarningClose}
            severity='warning'
            sx={{ width: '100%' }}
          >
            {alert?.message}
          </Alert>
        </Snackbar>
      </div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <div className='create-procurement-order-section'>
        <div>
          <Paper elevation={2} className='create-procurement-order-paper'>
            <form>
              <FormGroup className='create-procurement-order-form'>
                <div className='text-fields'>
                  <Grid container direction={'column'} spacing={3}>
                    <Grid item>
                      <TextField
                        id='payment-status-select-label'
                        label='Payment Status'
                        defaultValue='PENDING'
                        variant='filled'
                        disabled
                        fullWidth
                      ></TextField>
                    </Grid>
                    <Grid item>
                      <TextField
                        id='supplier-select-label'
                        label='Supplier'
                        name='supplier_id'
                        value={newProcurementOrder?.supplier_id}
                        onChange={handleEditProcurementOrder}
                        select
                        required
                        fullWidth
                      >
                        {suppliers.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Grid container direction={'column'} spacing={3}>
                    <Grid item>
                      <TextField
                        id='warehouse-address-select-label'
                        label='Warehouse Name'
                        name='warehouse_address'
                        value={newProcurementOrder?.warehouse_address}
                        onChange={handleEditProcurementOrder}
                        select
                        required
                        fullWidth
                      >
                        {warehouseData.map((option) => (
                          <MenuItem key={option.id} value={option.address}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item>
                      <TextField
                        id='outlined-required'
                        label='Description'
                        name='description'
                        value={newProcurementOrder?.description}
                        onChange={handleEditProcurementOrder}
                        placeholder='Enter any description here.'
                        required
                        fullWidth
                        multiline
                        maxRows={4}
                      />
                    </Grid>
                  </Grid>
                </div>
              </FormGroup>
            </form>
          </Paper>
          <div>
            <h2>Order Items</h2>
            <Snackbar
              open={openSuccess}
              autoHideDuration={6000}
              onClose={handleSuccessClose}
            >
              <Alert
                onClose={handleSuccessClose}
                severity='success'
                sx={{ width: '100%' }}
              >
                Added Product to Order Successfully!
              </Alert>
            </Snackbar>
            <Snackbar
              open={openFailure}
              autoHideDuration={6000}
              onClose={handleFailureClose}
            >
              <Alert
                onClose={handleFailureClose}
                severity='error'
                sx={{ width: '100%' }}
              >
                {alert?.message}
              </Alert>
            </Snackbar>
            <DataGrid columns={columns} rows={orderItems} autoHeight />
            <div className='button-container'>
              <Button
                variant='contained'
                size='medium'
                sx={{ height: 'fit-content' }}
                onClick={() => setModalOpen(true)}
              >
                Add Product to Order
              </Button>
              <AddProductModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleAddOrderItem}
                title='Add Product to Order'
              />
              <Button
                type='submit'
                variant='contained'
                size='medium'
                sx={{ height: 'fit-content' }}
                onClick={handleOrderCreation}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProcurementOrder;
