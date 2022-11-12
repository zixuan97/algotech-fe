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
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridValueGetterParams
} from '@mui/x-data-grid';
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
  const [disableSelectSupplier, setDisableSelectSupplier] =
    React.useState<boolean>(false);
  const id = searchParams.get('id');

  const [currency, setCurrency] = React.useState<string>('-');

  React.useEffect(() => {
    asyncFetchCallback(getAllSuppliers(), setSuppliers);
    asyncFetchCallback(getAllLocations(), setWarehouseData);

    if (id) {
      setModalOpen(true);
      setProductIdToDisplay(parseInt(id));
    }
  }, [id]);

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

  const handleEditSupplier = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newSupplier = suppliers.find(
      (supplier) => supplier.id.toString() == e.target.value
    );
    setNewProcurementOrder((prev) => ({
      ...prev,
      supplier: newSupplier
    }));
    setCurrency(newSupplier!.currency);
  };

  const handleEditLocation = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewProcurementOrder((prev) => ({
      ...prev,
      location: warehouseData.find(
        (warehouse) => warehouse.id.toString() == e.target.value
      )
    }));

  const removeOrderItem = (id: string) => {
    const updatedOrderItems = orderItems.filter(
      (item) => item.product?.id.toString() !== id
    );
    setOrderItems(updatedOrderItems);

    setAddedProductsId(
      addedProductsId.filter((addedId) => addedId.toString() !== id)
    );

    if (updatedOrderItems.length === 0) {
      setDisableSelectSupplier(false);
    }
  };

  const handleAddOrderItem = async (
    rate: string,
    quantity: string,
    selectedProduct: Product | undefined,
    supplierId: string | undefined
  ) => {
    setModalOpen(false);
    setLoading(true);

    if (supplierId) {
      setNewProcurementOrder((prev) => ({
        ...prev,
        supplier: suppliers.find(
          (supplier) => supplier.id.toString() == supplierId
        )
      }));
    }

    if (selectedProduct) {
      let newProcurementOrderItem: NewProcurementOrderItem = {
        quantity: parseInt(quantity),
        rate: parseInt(rate),
        product: selectedProduct
      };
      let updatedOrderItems = Object.assign([], orderItems);
      setAddedProductsId((prev) => [...prev, selectedProduct.id]);
      updatedOrderItems.push(newProcurementOrderItem);
      setOrderItems(updatedOrderItems);
      setLoading(false);
      setAlert({
        severity: 'success',
        message: 'Product added to order successfully!'
      });
      setDisableSelectSupplier(true);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params.row.product.sku
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params.row.product.name
    },
    {
      field: 'rate',
      renderHeader: (params: GridColumnHeaderParams) => (
        <strong>{`Rate per Unit (${currency.split(' - ')[0]})`}</strong>
      ),
      flex: 1
    },
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
    if (newProcurementOrder.supplier === undefined) {
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

    if (newProcurementOrder.location === undefined) {
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
      ({ product, quantity, rate }) => ({
        productSku: product?.sku,
        quantity,
        productName: product?.name,
        rate
      })
    );

    let reqBody = {
      description: newProcurementOrder.description,
      paymentStatus: 'PENDING',
      fulfilmentStatus: 'CREATED',
      procOrderItems: finalProcurementOrderItems,
      supplierId: newProcurementOrder.supplier!.id,
      warehouseName: newProcurementOrder.location!.name,
      warehouseAddress: newProcurementOrder.location!.address
    };

    await asyncFetchCallback(
      createProcurementOrder(reqBody),
      (res) => {
        setLoading(false);
        setAlert({
          severity: 'success',
          message: 'Procurement Order successfully created!'
        });
        setTimeout(() => navigate('/procurementOrders'), 3000);
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
                  value={newProcurementOrder.supplier?.id}
                  onChange={handleEditSupplier}
                  select
                  required
                  fullWidth
                  variant={disableSelectSupplier ? 'filled' : 'outlined'}
                  disabled={disableSelectSupplier}
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
                  value={newProcurementOrder.location?.address}
                  onChange={handleEditLocation}
                  select
                  required
                  fullWidth
                >
                  {warehouseData.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
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
              getRowId={(row) => row.product.id}
            />
            <div className='create-button-container'>
              <Button
                variant='contained'
                size='medium'
                sx={{ height: 'fit-content' }}
                onClick={() => setModalOpen(true)}
              >
                Add Product to Order
              </Button>
              <AddProductModal
                suppliers={suppliers}
                productIdToDisplay={productIdToDisplay}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleAddOrderItem}
                title='Add Product to Order'
                addedProductsId={addedProductsId}
                selectedSupplierId={newProcurementOrder?.supplier?.id}
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
