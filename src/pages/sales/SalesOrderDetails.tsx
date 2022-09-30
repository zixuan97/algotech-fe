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
  SalesOrderBundleItem,
  SalesOrderItem
} from 'src/models/types';
import { useNavigate, createSearchParams } from 'react-router-dom';
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
import { steps } from '../../components/sales/order/steps';
import OrderInfoGrid from '../../components/sales/order/OrderInfoGrid';
import OrderSummaryCard from '../../components/sales/order/OrderSummaryCard';
import StatusStepper from '../../components/sales/order/StatusStepper';
import PlatformChip from '../../components/sales/order/PlatformChip';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import ViewCurrentBundleModal from './ViewCurrentBundleModal';

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
  const [availBundleProducts, setAvailBundleProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showCurrentBundleModal, setShowCurrentBundleModal] =
    useState<boolean>(false);
  const [editSalesOrderBundleItems, setEditSalesOrderBundleItems] = useState<
    SalesOrderBundleItem[]
  >([]);
  const [newSalesOrderBundleItem, setNewSalesOrderBundleItem] =
    useState<SalesOrderBundleItem>();
  const [tempBundleItems, setTempBundleItems] = useState<
    SalesOrderBundleItem[]
  >([]);

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
        } else if (
          params.row.salesOrderBundleItems.length > 0 &&
          salesOrder?.orderStatus === OrderStatus.PREPARING
        ) {
          return (
            <>
              <Button
                onClick={() => {
                  setEditSalesOrderBundleItems(
                    params.row.salesOrderBundleItems
                  );
                  setTempBundleItems(params.row.salesOrderBundleItems);
                  setShowCurrentBundleModal(true);
                }}
                variant='contained'
                size='medium'
              >
                View Bundle
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
            setAvailBundleProducts(products);
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
    if (activeStep < steps.length - 1 && activeStep <= 3) {
      const newStatus = steps[activeStep + 1].currentState;
      if (newStatus === OrderStatus.PREPARED) {
        setModalOpen(true);
      } else if (newStatus === OrderStatus.READY_FOR_DELIVERY) {
        id &&
          navigate({
            pathname: '/delivery/allManualDeliveries/createDelivery',
            search: createSearchParams({
              id: id.toString()
            }).toString()
          });
      } else {
        updateSalesOrderStatus(newStatus);
      }
    }
  };

  const updateSalesOrderStatus = (newStatus: OrderStatus) => {
    id &&
      asyncFetchCallback(
        updateSalesOrderStatusSvc(id, newStatus),
        () => {
          setAlert({
            severity: 'success',
            message: `The order status has been updated. You can now ${steps[
              activeStep + 1
            ].nextAction.toLowerCase()}.`
          });
          setSalesOrder(
            (order) => order && { ...order, orderStatus: newStatus }
          );
          setActiveStep((prev) => prev + 1);
        },
        () => {
          setAlert({
            severity: 'error',
            message: `The order cannot be updated at this moment. Contact the admin for assistance.`
          });
        }
      );
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

  const updateSalesOrderWithNewSalesOrderItem = () => {
    salesOrder &&
      asyncFetchCallback(
        completeOrderPrepSvc(
          salesOrder && {
            ...salesOrder,
            orderStatus: OrderStatus.PREPARED,
            salesOrderItems: editSalesOrderItems
          }
        ),
        () => {
          setSalesOrder(
            (order) =>
              order && {
                ...order,
                orderStatus: OrderStatus.PREPARED,
                salesOrderItems: editSalesOrderItems.map((item) => {
                  delete item.isNewAdded;
                  return item;
                })
              }
          );
          updateSalesOrderStatus(OrderStatus.PREPARED);
          setModalOpen(false);
        },
        () => {
          setModalOpen(false);
          setAlert({
            severity: 'error',
            message: `The order cannot be updated at this moment. Contact the admin for assistance.`
          });
        }
      );
  };

  const removeItemFromBundleItems = (productName: String) => {
    const temp = [...tempBundleItems];
    temp.splice(
      temp.indexOf(
        temp.find((item) => {
          return item.productName === productName && item.isNewAdded;
        })!
      )
    );
    setEditSalesOrderBundleItems(temp);
    setAvailBundleProducts((prev) => [
      ...prev,
      products.find((prod) => {
        return prod.name === productName;
      })!
    ]);
  };

  const addNewItemToBundleItems = () => {
    setEditSalesOrderBundleItems((current) => [
      ...current,
      newSalesOrderBundleItem!
    ]);
    setAvailBundleProducts((current) =>
      current.filter((product) => {
        return product.name !== newSalesOrderBundleItem?.productName;
      })
    );
    setTempBundleItems((current) => [...current, newSalesOrderBundleItem!]);
  };

  const updateNewSalesOrderBundleItem = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setNewSalesOrderBundleItem((bundleItem) => {
      return {
        ...bundleItem!,
        [key]:
          key === 'quantity' ? event.target.valueAsNumber : event.target.value,
        isNewAdded: true,
        salesOrderId: salesOrder?.id!
      };
    });
  };

  const saveChangesToBundle = () => {
    const temp = [...editSalesOrderItems];
    const oldSaleOrderItem = temp.find((item) => {
      return item.id === editSalesOrderBundleItems[0]?.salesOrderItemId;
    });
    oldSaleOrderItem &&
      editSalesOrderBundleItems.forEach((item) => {
        item.isNewAdded &&
          (oldSaleOrderItem.salesOrderBundleItems = [
            ...oldSaleOrderItem.salesOrderBundleItems,
            item
          ]);
      });
    temp.splice(
      temp.indexOf(
        temp.find((item) => {
          return item.id === editSalesOrderBundleItems[0]?.salesOrderItemId;
        })!
      ),
      1,
      oldSaleOrderItem!
    );
    setEditSalesOrderItems(temp);
    setShowCurrentBundleModal(false);
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

      <ConfirmationModal
        title='Update Order State'
        body='You are updating the order, it is irreversible, are you sure?'
        onConfirm={updateSalesOrderWithNewSalesOrderItem}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />

      <ViewCurrentBundleModal
        open={showCurrentBundleModal}
        onClose={() => setShowCurrentBundleModal(false)}
        availProducts={availBundleProducts}
        editSalesOrderBundleItems={editSalesOrderBundleItems}
        updateNewSalesOrderBundleItem={updateNewSalesOrderBundleItem}
        addNewItemToBundleItems={addNewItemToBundleItems}
        removeItemFromBundleItems={removeItemFromBundleItems}
        onSave={saveChangesToBundle}
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
            <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
            <Paper elevation={2} className='action-card'>
              <OrderInfoGrid salesOrder={salesOrder!} />
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

          <Paper elevation={3}>
            <div className='content-body'>
              <div className='grid-toolbar'>
                <h4>Order ID.: #{salesOrder?.orderId}</h4>
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
