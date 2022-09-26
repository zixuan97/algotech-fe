import React, { useEffect, useState } from 'react';
import '../../styles/pages/sales/orders.scss';
import '../../styles/common/common.scss';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import {
  OrderStatus,
  Product,
  SalesOrder,
  SalesOrderItem
} from 'src/models/types';
import { useNavigate } from 'react-router-dom';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import inventoryContext from 'src/context/inventory/inventoryContext';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddSalesOrderItemModal from './AddSalesOrderItemModal';
import {
  completeOrderPrepSvc,
  getSalesOrderDetailsSvc,
  updateSalesOrderStatusSvc
} from 'src/services/salesService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { steps } from 'src/components/sales/order/steps';
import OrderInfoGrid from 'src/components/sales/order/OrderInfoGrid';
import OrderSummaryCard from 'src/components/sales/order/OrderSummaryCard';
import StatusStepper from 'src/components/sales/order/StatusStepper';
import PlatformChip from 'src/components/sales/order/PlatformChip';

const SalesOrderDetails = () => {
  let params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const navigate = useNavigate();
  const { products } = React.useContext(inventoryContext);
  const [salesOrder, setSalesOrder] = useState<SalesOrder>();
  const [editSalesOrderItems, setEditSalesOrderItems] = useState<
    SalesOrderItem[]
  >([]);
  const [newSalesOrderItem, setNewSalesOrderItem] = useState<SalesOrderItem>();
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [availProducts, setAvailProducts] = useState<Product[]>([]);

  const columns: GridColDef[] = [
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 2,
      valueGetter: (params) => params.row.productName
    },
    {
      field: 'quantity',
      type: 'number',
      headerName: 'Quantity',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'price',
      type: 'number',
      headerName: 'Price',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params) => params.row.price ?? 0,
      valueFormatter: (params) => params.value.toFixed(2)
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
              <Button
                variant='contained'
                size='medium'
                onClick={() => {
                  removeItemFromList(params.row.productName);
                }}
              >
                Remove Item
              </Button>
            </>
          );
        }
      }
    }
  ];

  useEffect(() => {
    setLoading(true);
    id &&
      asyncFetchCallback(
        getSalesOrderDetailsSvc(id),
        (salesOrder: SalesOrder) => {
          if (salesOrder) {
            setSalesOrder(salesOrder);
            setEditSalesOrderItems([...salesOrder.salesOrderItems]);
            setAvailProducts(products);
            setActiveStep(
              steps.findIndex(
                (step) => step.currentState === salesOrder.orderStatus
              )
            );
            setLoading(false);
          } else {
            setAlert({
              severity: 'error',
              message:
                'Sales Order does not exist. You will be redirected back to the Sales Order Overview page.'
            });
            setLoading(false);
            setTimeout(() => navigate('/allSalesOrders'), 3500);
          }
        }
      );
  }, [id, navigate, products]);

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
      const newStatus = steps[activeStep + 1].currentState;
      if (newStatus === OrderStatus.PREPARED) {
        salesOrder &&
          asyncFetchCallback(
            completeOrderPrepSvc(
              salesOrder && {
                ...salesOrder,
                orderStatus: newStatus,
                salesOrderItems: editSalesOrderItems
              }
            ),
            () => {
              setSalesOrder(
                (order) =>
                  order && {
                    ...order,
                    orderStatus: newStatus,
                    salesOrderItems: editSalesOrderItems.map((item) => {
                      delete item.isNewAdded;
                      return item;
                    })
                  }
              );
            }
          );
      } else {
        setSalesOrder((order) => order && { ...order, orderStatus: newStatus });
      }
      id && updateSalesOrderStatusSvc(id, newStatus);
    }
  };

  const addNewItemToEditSalesOrderItems = () => {
    setEditSalesOrderItems((current) => [...current, newSalesOrderItem!]);
    setShowDialog(false);
    setAvailProducts((current) =>
      current.filter((product) => {
        return product.name !== newSalesOrderItem?.productName;
      })
    );
  };

  const updateNewSalesOrderItem = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setNewSalesOrderItem((orderItem) => {
      return {
        ...orderItem!,
        [key]:
          key === 'quantity' ? event.target.valueAsNumber : event.target.value,
        price: 0,
        isNewAdded: true,
        salesOrderId: salesOrder?.id!,
        createdTime: salesOrder?.createdTime
      };
    });
  };

  const removeItemFromList = (productName: String) => {
    const temp = [...editSalesOrderItems];
    temp.splice(
      temp.indexOf(
        temp.find((item) => {
          return item.productName === productName && item.isNewAdded;
        })!
      )
    );
    setEditSalesOrderItems(temp);
    setAvailProducts((prev) => [
      ...prev,
      products.find((prod) => {
        return prod.name === productName;
      })!
    ]);
  };

  return (
    <>
      <AddSalesOrderItemModal
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title='Add New Product To This Order.'
        body='Fill up the form to add new products to the order.'
        availProducts={availProducts}
        addNewSalesOrderItem={addNewItemToEditSalesOrderItems}
        orderFieldOnChange={updateNewSalesOrderItem}
      />

      <div className='top-carrot'>
        <Tooltip title='Return to Sales Order' enterDelay={300}>
          <IconButton size='large' onClick={() => navigate(-1)}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <PlatformChip salesOrder={salesOrder!} pretext={'Placed with'} />
      </div>

      <div className='center-div'>
        <Box className='center-box'>
          <div className='sales-header-content'>
            <StatusStepper orderStatus={salesOrder?.orderStatus!} />
            <Paper elevation={2} className='action-card'>
              <OrderInfoGrid
                custName={salesOrder?.customerName!}
                contactNo={salesOrder?.customerContactNo!}
                email={salesOrder?.customerEmail ?? 'NA'}
                address={salesOrder?.customerAddress!}
              />
              <div className='action-box'>
                <Typography sx={{ fontSize: 'inherit' }}>
                  Next Action:
                </Typography>
                <Button variant='contained' size='medium' onClick={nextStep}>
                  {steps[activeStep].nextAction}
                </Button>
              </div>
            </Paper>
          </div>

          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />

          <Paper elevation={3}>
            <div className='content-body'>
              <div className='grid-toolbar'>
                <h4>Order ID.: #{salesOrder?.id}</h4>
                {salesOrder?.orderStatus === OrderStatus.PREPARING && (
                  <div className='button-group'>
                    <Button
                      variant='contained'
                      size='medium'
                      onClick={() => {
                        setShowDialog(true);
                      }}
                    >
                      Add Items
                    </Button>
                  </div>
                )}
              </div>
              <DataGrid
                columns={columns}
                rows={editSalesOrderItems ?? []}
                getRowId={(row) => editSalesOrderItems.indexOf(row)}
                autoHeight
                pageSize={5}
              />
              <OrderSummaryCard salesOrder={salesOrder!} />
            </div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default SalesOrderDetails;
