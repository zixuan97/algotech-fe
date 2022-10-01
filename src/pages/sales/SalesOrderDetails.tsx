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
import { ChevronLeft, Info } from '@mui/icons-material';
import {
  OrderStatus,
  PlatformType,
  Product,
  SalesOrder,
  SalesOrderBundleItem,
  SalesOrderItem,
  ShippingType
} from 'src/models/types';
import { useNavigate, createSearchParams } from 'react-router-dom';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import inventoryContext from 'src/context/inventory/inventoryContext';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddSalesOrderItemModal from './AddSalesOrderItemModal';
import {
  completeOrderPrepSvc,
  getDeliveryTypeSvc,
  getSalesOrderDetailsByOrderIdSvc,
  getSalesOrderDetailsSvc,
  updateSalesOrderStatusSvc
} from 'src/services/salesService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { steps } from '../../components/sales/order/steps';
import OrderInfoGrid from '../../components/sales/order/OrderInfoGrid';
import OrderSummaryCard from '../../components/sales/order/OrderSummaryCard';
import StatusStepper from '../../components/sales/order/StatusStepper';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import ViewCurrentBundleModal from './ViewCurrentBundleModal';

const SalesOrderDetails = () => {
  let params = new URLSearchParams(window.location.search);
  // search by either or
  const id = params.get('id');
  const orderId = params.get('orderId');
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
  const [saleOrderLineItemId, setSaleOrderLineItemId] = useState<number>(0);
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
          Array.from(params.row.salesOrderBundleItems).length > 0 &&
          salesOrder?.orderStatus === OrderStatus.PREPARING
        ) {
          return (
            <>
              <Button
                onClick={() => {
                  setEditSalesOrderBundleItems(
                    params.row.salesOrderBundleItems
                  );
                  setSaleOrderLineItemId(params.row.id);
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
    if (editSalesOrderBundleItems) {
      setAvailBundleProducts(
        products.filter((product) => {
          return !editSalesOrderBundleItems.some((bundleItem) => {
            return product.name === bundleItem.productName;
          });
        })
      );
    }
  }, [editSalesOrderBundleItems, products]);

  useEffect(() => {
    setLoading(true);
    const successCallback = (salesOrder: SalesOrder) => {
      setSalesOrder(salesOrder);
      setEditSalesOrderItems([...salesOrder.salesOrderItems]);
      setAvailProducts(products);
      setAvailBundleProducts(products);
      setActiveStep(
        steps.findIndex((step) => step.currentState === salesOrder.orderStatus)
      );
      setLoading(false);
    };
    const errorCallback = () => {
      setAlert({
        severity: 'error',
        message:
          'Sales Order does not exist. You will be redirected back to the Sales Order Overview page.'
      });
      setLoading(false);
      setTimeout(() => navigate('/sales/allSalesOrders'), 3500);
    };
    if (id) {
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
            setTimeout(() => navigate('/sales/allSalesOrders'), 3500);
          }
        }
      );
    } else if (orderId) {
      asyncFetchCallback(
        getSalesOrderDetailsByOrderIdSvc(orderId),
        successCallback,
        errorCallback
      );
    }
  }, [id, orderId, navigate, products]);

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      const newStatus = steps[activeStep + 1].currentState;
      if (newStatus === OrderStatus.PREPARED) {
        setModalOpen(true);
      } else if (
        newStatus === OrderStatus.READY_FOR_DELIVERY &&
        (salesOrder?.platformType === PlatformType.SHOPIFY ||
          salesOrder?.platformType === PlatformType.OTHERS)
      ) {
        salesOrder.id &&
          navigate({
            pathname: '/delivery/createDelivery',
            search: createSearchParams({
              id: salesOrder.id.toString()
            }).toString()
          });
      } else if (
        activeStep > 3 &&
        (salesOrder?.platformType === PlatformType.SHOPIFY ||
          salesOrder?.platformType === PlatformType.OTHERS)
      ) {
        salesOrder.id &&
          asyncFetchCallback(getDeliveryTypeSvc(salesOrder.id), (res) => {
            if (res.shippingType === ShippingType.SHIPPIT) {
              navigate({
                pathname: '/delivery/shippitDeliveryDetails',
                search: createSearchParams({
                  id: res.shippitTrackingNum.toString()
                }).toString()
              });
            } else if (res.shippingType === ShippingType.MANUAL) {
              navigate({
                pathname: '/delivery/manualDeliveryDetails',
                search: createSearchParams({
                  id: res.id.toString()
                }).toString()
              });
            }
          });
      } else {
        updateSalesOrderStatus(newStatus);
      }
    }
  };

  const updateSalesOrderStatus = (newStatus: OrderStatus) => {
    salesOrder?.id &&
      asyncFetchCallback(
        updateSalesOrderStatusSvc(salesOrder.id, newStatus),
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
        createdTime: salesOrder?.createdTime,
        salesOrderBundleItems: []
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

  const removeItemFromBundleItems = (
    productName: String,
    salesOrderItemId: number,
    idx?: number
  ) => {
    const bundleItemsToUpdate = [...editSalesOrderBundleItems];
    if (idx && bundleItemsToUpdate[0].id === idx) {
      bundleItemsToUpdate.splice(0, 1);
    } else {
      if (idx) {
        console.log('idx', idx);
        console.log('bundleItemsToUpdate', bundleItemsToUpdate);
        console.log();
        bundleItemsToUpdate.splice(
          bundleItemsToUpdate.findIndex((item) => {
            return item.id === idx;
          })!,
          1
        );
      } else {
        bundleItemsToUpdate.splice(
          bundleItemsToUpdate.findIndex((item) => {
            return item.productName === productName && item.isNewAdded;
          })!,
          1
        );
      }
    }
    setEditSalesOrderBundleItems(bundleItemsToUpdate);
    if (
      !availBundleProducts.find((product) => {
        return product.name === productName;
      })
    ) {
      setAvailBundleProducts((prev) => [
        ...prev,
        products.find((prod) => {
          return prod.name === productName;
        })!
      ]);
    }
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
        isNewAdded: true
      };
    });
  };

  const saveChangesToBundle = () => {
    const temp = [...editSalesOrderItems];
    if (editSalesOrderBundleItems.length > 0) {
      const oldSaleOrderItem = JSON.parse(
        JSON.stringify(
          temp.find((item) => {
            return item.id === saleOrderLineItemId;
          })
        )
      );
      oldSaleOrderItem!.salesOrderBundleItems.splice(
        0,
        oldSaleOrderItem!.salesOrderBundleItems.length,
        ...editSalesOrderBundleItems
      );
      temp.splice(
        temp.indexOf(
          temp.find((item) => {
            return item.id === oldSaleOrderItem.id;
          })!
        ),
        1,
        oldSaleOrderItem!
      );
    }
    setEditSalesOrderItems(temp);
    setShowCurrentBundleModal(false);
  };

  return (
    <>
      <AddSalesOrderItemModal
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
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
        onClose={() => {
          setShowCurrentBundleModal(false);
          setAvailBundleProducts(products);
        }}
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
                <Button
                  variant='contained'
                  size='medium'
                  onClick={nextStep}
                  disabled={
                    (salesOrder?.platformType === PlatformType.SHOPEE ||
                      salesOrder?.platformType === PlatformType.LAZADA) &&
                    activeStep > 2
                  }
                >
                  {steps[activeStep].nextAction}
                </Button>
              </div>
            </Paper>
          </div>

          <Paper elevation={3}>
            <div className='content-body'>
              <div className='grid-toolbar'>
                <h4>Order ID: #{salesOrder?.orderId}</h4>
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
