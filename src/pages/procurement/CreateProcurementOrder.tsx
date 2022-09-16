import React from 'react';
import { useNavigate } from 'react-router';
import {
  Tooltip,
  IconButton,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Backdrop,
  Grid
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import {
  ProcurementOrder,
  Supplier,
  Location,
  Product
} from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  createProcurementOrder,
  getAllSuppliers
} from 'src/services/procurementService';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddProductModal from 'src/components/procurement/AddProductModal';
import '../../styles/pages/procurement.scss';
import { ProcurementOrderItem } from 'src/models/types';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import { getAllLocations } from 'src/services/locationService';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSearchParams } from 'react-router-dom';

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
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [addedProductsId, setAddedProductsId] = React.useState<number[]>([]);
  const [productIdToDisplay, setProductIdToDisplay] = React.useState<number>();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  React.useEffect(() => {
    asyncFetchCallback(getAllSuppliers(), setSuppliers);
    asyncFetchCallback(getAllLocations(), setWarehouseData);

    if (id) {
      setModalOpen(true);
      setProductIdToDisplay(parseInt(id));
    }
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

  const removeOrderItem = (id: string) => {
    const updatedOrderItems = orderItems.filter(
      (item) => item.id?.toString() != id
    );
    setOrderItems(updatedOrderItems);
  };

  const handleAddOrderItem = async (
    sku: string,
    rate: string,
    quantity: string,
    selectedProduct: Product | undefined
  ) => {
    setModalOpen(false);
    setLoading(true);

    if (selectedProduct) {
      let newProcurementOrderItem: NewProcurementOrderItem = {
        id: selectedProduct.id,
        quantity: parseInt(quantity),
        product_sku: sku,
        rate: parseInt(rate),
        product_name: selectedProduct.name
      };
      let updatedOrderItems = Object.assign([], orderItems);
      setAddedProductsId((prev) => [...prev, selectedProduct.id]);
      console.log(addedProductsId);
      updatedOrderItems.push(newProcurementOrderItem);
      setOrderItems(updatedOrderItems);
      setLoading(false);
      setAlert({
        severity: 'success',
        message: 'Product added to order successfully!'
      });
    }
  };

  const columns: GridColDef[] = [
    { field: 'product_sku', headerName: 'SKU', flex: 1 },
    { field: 'product_name', headerName: 'Product Name', flex: 1 },
    { field: 'rate', headerName: 'Rate per Unit', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ id }: GridRenderCellParams) => {
        return (
          <Button
            variant='outlined'
            startIcon={<DeleteIcon />}
            onClick={() => removeOrderItem(id.toString())}
          >
            Delete
          </Button>
        );
      }
    }
  ];

  const handleOrderCreation = async () => {
    if (newProcurementOrder.supplier_id === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please Select a Supplier!'
      });
      return;
    }

    if (newProcurementOrder.description === undefined) {
      newProcurementOrder.description = '';
      setNewProcurementOrder(newProcurementOrder);
    }

    if (newProcurementOrder.warehouse_address === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please Select a Warehouse Address!'
      });
      return;
    }

    if (orderItems.length === 0) {
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
        // toast.success(
        //   'Order created! A confirmation email has been sent to the supplier.',
        //   {
        //     position: 'top-right',
        //     autoClose: 6000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined
        //   }
        // );
        // navigate('/orders');
        setAlert({
          severity: 'success',
          message: 'Procurement Order successfully created!'
        });
        setTimeout(() => navigate('/orders'), 3000);
      },
      (err) => {
        setLoading(false);
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
        {alert && (
          <TimeoutAlert
            alert={alert}
            timeout={6000}
            clearAlert={() => setAlert(null)}
          />
        )}
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
          <form>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  id='payment-status-select-label'
                  label='Payment Status'
                  defaultValue='PENDING'
                  variant='filled'
                  disabled
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <TextField
                  id='outlined-required'
                  label='Comments'
                  name='comments'
                  value={newProcurementOrder?.description}
                  onChange={handleEditProcurementOrder}
                  placeholder='Enter any comments here.'
                  fullWidth
                  multiline
                  maxRows={4}
                />
              </Grid>
            </Grid>
          </form>
          <div className='order-items-section'>
            <h2>Order Items</h2>
            <DataGrid
              columns={columns}
              rows={orderItems}
              autoHeight
              getRowId={(row) => row.product_sku}
            />
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
                productIdToDisplay={productIdToDisplay}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleAddOrderItem}
                title='Add Product to Order'
                addedProductsId={addedProductsId}
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
