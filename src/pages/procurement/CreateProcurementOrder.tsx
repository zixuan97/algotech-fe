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
  Alert
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { ProcurementOrder, Supplier } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllSuppliers } from 'src/services/procurementService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddProductModal from 'src/components/procurement/AddProductModal';
import '../../styles/pages/procurement.scss';
import { getProductBySku } from 'src/services/productService';
import { ProcurementOrderItem } from 'src/models/types';

const columns: GridColDef[] = [
  { field: 'product_sku', headerName: 'SKU', flex: 1 },
  { field: 'product_name', headerName: 'Product Name', flex: 1 },
  { field: 'rate', headerName: 'Rate per Unit', flex: 1 },
  { field: 'quantity', headerName: 'Quantity', flex: 1 }
];

const data = [
  {
    id: 1,
    orderId: 1234,
    date: '03/03/12 22:43',
    supplierId: 456
  },
  {
    id: 2,
    orderId: 1234,
    date: '03/03/12 22:43',
    supplierId: 456
  }
];

type NewProcurementOrder = Partial<ProcurementOrder> & {};
type NewProcurementOrderItem = Partial<ProcurementOrderItem>;

const CreateProcurementOrder = () => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [newProcurementOrder, setNewProcurementOrder] =
    React.useState<NewProcurementOrder>({});
  const [orderItems, setOrderItems] = React.useState<NewProcurementOrderItem[]>(
    []
  );
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openFailure, setOpenFailure] = React.useState(false);

  React.useEffect(() => {
    asyncFetchCallback(getAllSuppliers(), setSuppliers);
  }, []);

  const handleEditProcurementOrder = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewProcurementOrder((prev) => {
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
    await asyncFetchCallback(getProductBySku(sku), (res) => {
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
    });
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
      <div className='create-procurement-order-section'>
        <Paper elevation={2} className='create-procurement-order-paper'>
          <form>
            <FormGroup className='create-procurement-order-form'>
              <div className='text-fields'>
                {/* <div className='horizontal-text-fields'> */}
                <TextField
                  id='payment-status-select-label'
                  label='Payment Status'
                  defaultValue='PENDING'
                  variant='filled'
                  disabled
                  fullWidth
                ></TextField>
                <TextField
                  id='supplier-select-label'
                  label='Supplier'
                  value={newProcurementOrder?.supplier_id}
                  onChange={handleEditProcurementOrder}
                  select
                  required
                  fullWidth
                >
                  {suppliers.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                {/* </div> */}
                <TextField
                  id='outlined-required'
                  label='Comments'
                  name='comments'
                  value={newProcurementOrder?.description}
                  onChange={handleEditProcurementOrder}
                  placeholder='Enter any comments here.'
                  required
                  fullWidth
                  multiline
                  maxRows={4}
                />
              </div>
            </FormGroup>
          </form>
        </Paper>
        <div>
          <h2>Order Items</h2>
          <Snackbar
            open={openSuccess}
            autoHideDuration={3000}
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
              variant='contained'
              size='medium'
              sx={{ height: 'fit-content' }}
              onClick={() => setModalOpen(true)}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProcurementOrder;
