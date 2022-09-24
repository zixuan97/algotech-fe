import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/pages/sales/orders.scss';
import '../../styles/common/common.scss';
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography
} from '@mui/material';
import {
  ChevronLeft,
  ReceiptLongRounded,
  AccountBalanceWalletRounded,
  PlaylistAddCheckCircleRounded,
  LocalShippingRounded,
  TaskAltRounded,
  AddShoppingCart
} from '@mui/icons-material';
import {
  OrderStatus,
  PlatformType,
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
  getSalesOrderDetailsSvc
} from 'src/services/salesService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';

const steps = [
  {
    label: 'Order Placed',
    icon: <ReceiptLongRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Confirm Payment'
  },
  {
    label: 'Order Paid',
    icon: <AccountBalanceWalletRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Begin Prep'
  },
  {
    label: 'Preparing Order',
    icon: <AddShoppingCart sx={{ fontSize: 35 }} />,
    nextAction: 'Complete Prep'
  },
  {
    label: 'Order Prepared',
    icon: <PlaylistAddCheckCircleRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Schedule Delivery'
  },
  {
    label: 'Order Shipped',
    icon: <LocalShippingRounded sx={{ fontSize: 35 }} />,
    nextAction: 'View Delivery'
  },
  {
    label: 'Order Received',
    icon: <TaskAltRounded sx={{ fontSize: 35 }} />,
    nextAction: 'View Delivery'
  }
];

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
      flex: 1
    },
    {
      field: 'price',
      type: 'number',
      headerName: 'Price',
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
        if (
          params.row.isNewAdded &&
          salesOrder?.orderStatus === OrderStatus.PREPARING
        ) {
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
            setAvailProducts(
              products.filter((product) => {
                return salesOrder?.salesOrderItems.find(
                  (orderItem) => orderItem.productName !== product.name
                );
              })
            );
            switch (salesOrder.orderStatus) {
              case OrderStatus.CREATED: {
                setActiveStep(0);
                break;
              }
              case OrderStatus.PAID: {
                setActiveStep(1);
                break;
              }
              case OrderStatus.PREPARING: {
                setActiveStep(2);

                break;
              }
              case OrderStatus.PREPARED: {
                setActiveStep(3);
                break;
              }
              case OrderStatus.SHIPPED: {
                setActiveStep(4);
                break;
              }
              case OrderStatus.COMPLETED: {
                setActiveStep(5);
                break;
              }
              default: {
                break;
              }
            }
            setLoading(false);
          } else {
            setAlert({
              severity: 'error',
              message:
                'Sales Order does nto exist. You will be redirected back to the Sales Order Overview page.'
            });
            setLoading(false);
            setTimeout(() => navigate('/allSalesOrders'), 3500);
          }
        }
      );
  }, [id, navigate, products]);

  const nextStep = () => {
    switch (salesOrder?.orderStatus) {
      case OrderStatus.CREATED: {
        setSalesOrder((order) => {
          return {
            ...order!,
            orderStatus: OrderStatus.PAID
          };
        });
        setActiveStep(1);
        break;
      }
      case OrderStatus.PAID: {
        setSalesOrder((order) => {
          return {
            ...order!,
            orderStatus: OrderStatus.PREPARING
          };
        });
        setActiveStep(2);
        break;
      }
      case OrderStatus.PREPARING: {
        setSalesOrder((order) => {
          return {
            ...order!,
            orderStatus: OrderStatus.PREPARED,
            salesOrderItems: editSalesOrderItems
          };
        });
        setActiveStep(3);
        updateSalesOrder();
        break;
      }
      case OrderStatus.PREPARED: {
        setSalesOrder((order) => {
          return {
            ...order!,
            orderStatus: OrderStatus.SHIPPED
          };
        });
        //Note that IRL this should not allow users to go next step.
        //It should ONLY allow users to print View DO.
        //Only in 'View Delivery Order', can users to trigger to OrderStatus.SHIPPED
        //This is only for display
        setActiveStep(4);
        break;
      }
      case OrderStatus.SHIPPED: {
        setSalesOrder((order) => {
          return {
            ...order!,
            orderStatus: OrderStatus.COMPLETED
          };
        });
        setActiveStep(5);
        break;
      }
      case OrderStatus.COMPLETED: {
        break;
      }
      default: {
        break;
      }
    }
  };

  const updateSalesOrder = () => {
    salesOrder &&
      asyncFetchCallback(completeOrderPrepSvc(salesOrder) , () => {
        console.log('success');
      });
  };

  const addNewItemToSalesOrderItem = () => {
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
    const arr = editSalesOrderItems.filter(
      (item) => item.productName !== productName
    );
    setEditSalesOrderItems(arr);
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
        addNewSalesOrderItem={addNewItemToSalesOrderItem}
        orderFieldOnChange={updateNewSalesOrderItem}
      />

      <div className='top-carrot'>
        <Tooltip title='Return to Accounts' enterDelay={300}>
          <IconButton size='large' onClick={() => navigate(-1)}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>

        <div style={{ margin: '1%' }}>
          <Typography>Placed With</Typography>
          <Chip
            label={salesOrder?.platformType}
            color={
              salesOrder?.platformType === PlatformType.SHOPEE
                ? 'warning'
                : salesOrder?.platformType === PlatformType.SHOPIFY
                ? 'primary'
                : 'info'
            }
          />
        </div>
      </div>

      <div className='center-div'>
        <Box className='center-box'>
          <div className='sales-header-content'>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              className='sales-stepper'
            >
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel icon={step.icon}>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Paper elevation={2} className='action-card'>
              <div className='order-info-grid'>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    Customer Name: {salesOrder?.customerName}
                  </Grid>
                  <Grid item xs={6}>
                    Contact No.: {salesOrder?.customerContactNo}
                  </Grid>
                  <Grid item xs={12}>
                    Email: {salesOrder?.customerEmail ?? 'NA'}
                  </Grid>
                  <Grid item xs={12}>
                    Shipping Address: {salesOrder?.customerAddress}
                  </Grid>
                </Grid>
              </div>
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
                  <Button
                    variant='contained'
                    size='medium'
                    onClick={() => setShowDialog(true)}
                  >
                    Add Items
                  </Button>
                )}
              </div>
              <DataGrid
                columns={columns}
                rows={editSalesOrderItems ?? []}
                getRowId={(row) => editSalesOrderItems.indexOf(row)}
                autoHeight
                pageSize={5}
              />
              <div className='order-summary-card'>
                <div>
                  <h5>Merchandising Total: ${salesOrder?.amount}</h5>
                  <h5>Shipping: -</h5>
                  <h5>Order Subtotal: ${salesOrder?.amount}</h5>
                  <h5>
                    Payment Method:
                    {salesOrder?.platformType === PlatformType.OTHERS
                      ? ' PayNow'
                      : ' eCommerce'}
                  </h5>
                </div>
              </div>
            </div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default SalesOrderDetails;
