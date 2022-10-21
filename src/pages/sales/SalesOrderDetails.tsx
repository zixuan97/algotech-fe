import React, { useEffect, useMemo, useState } from 'react';
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
import AddSalesOrderItemModal from '../../components/sales/order/AddSalesOrderItemModal';
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
import ViewCurrentBundleModal from '../../components/sales/order/ViewCurrentBundleModal';
import OrderInfoEditGrid from 'src/components/sales/order/OrderInfoEditGrid';

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
  const [canEdit, setCanEdit] = useState<boolean>(false);

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
      valueFormatter: (params) => '$' + params.value.toFixed(2)
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
                  removeItemFromList(params.row.productName, params.row.id);
                }}
              >
                Remove Item
              </Button>
            </>
          );
        } else if (Array.from(params.row.salesOrderBundleItems).length > 0) {
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

  const statusStepper = useMemo(
    () =>
      salesOrder?.orderStatus === OrderStatus.CANCELLED
        ? steps.filter((step) => {
            return step.currentState !== OrderStatus.PAID;
          })
        : steps.filter((step) => {
            return step.currentState !== OrderStatus.CANCELLED;
          }),
    [salesOrder?.orderStatus]
  );

  useEffect(() => {
    if (salesOrder) {
      setCanEdit(salesOrder.orderStatus === OrderStatus.PREPARING);
    }

    if (statusStepper && salesOrder) {
      setActiveStep(
        statusStepper.findIndex(
          (step) => step.currentState === salesOrder.orderStatus
        )
      );
    }
  }, [salesOrder, statusStepper]);

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
      setLoading(false);
    };
    const errorCallback = () => {
      setAlert({
        severity: 'error',
        message: 'Sales Order does not exist. You will be redirected back.'
      });
      setLoading(false);
      setTimeout(() => navigate(-1), 3500);
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
            setLoading(false);
          } else {
            setAlert({
              severity: 'error',
              message:
                'Sales Order does not exist. You will be redirected back.'
            });
            setLoading(false);
            setTimeout(() => navigate(-1), 3500);
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
  }, [id, orderId, navigate, products, statusStepper]);

  const nextStep = () => {
    let newStatus = statusStepper[activeStep].currentState;
    if (activeStep < 6) {
      newStatus = statusStepper[activeStep + 1].currentState;
    }

    if (newStatus === OrderStatus.PREPARED) {
      setModalOpen(true);
    } else if (
      newStatus === OrderStatus.READY_FOR_DELIVERY &&
      (salesOrder?.platformType === PlatformType.SHOPIFY ||
        salesOrder?.platformType === PlatformType.OTHERS ||
        salesOrder?.platformType === PlatformType.B2B)
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
        salesOrder?.platformType === PlatformType.OTHERS ||
        salesOrder?.platformType === PlatformType.B2B)
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
  };

  const updateSalesOrderStatus = (newStatus: OrderStatus) => {
    salesOrder?.id &&
      asyncFetchCallback(
        updateSalesOrderStatusSvc(salesOrder.id, newStatus),
        () => {
          setAlert({
            severity: 'success',
            message: `The order status has been updated. You can now ${statusStepper[
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

  const removeItemFromList = (productName: String, idx: number) => {
    const salesOrderItemsToUpdate = [...editSalesOrderItems];
    if (idx && salesOrderItemsToUpdate[0].id === idx) {
      salesOrderItemsToUpdate.splice(0, 1);
    } else {
      if (idx) {
        salesOrderItemsToUpdate.splice(
          salesOrderItemsToUpdate.findIndex((item) => {
            return item.id === idx;
          })!,
          1
        );
      } else {
        salesOrderItemsToUpdate.splice(
          salesOrderItemsToUpdate.findIndex((item) => {
            return item.productName === productName && item.isNewAdded;
          })!,
          1
        );
      }
    }
    setEditSalesOrderItems(salesOrderItemsToUpdate);

    if (
      !availProducts.find((product) => {
        return product.name === productName;
      })
    ) {
      setAvailProducts((prev) => [
        ...prev,
        products.find((prod) => {
          return prod.name === productName;
        })!
      ]);
    }
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
        salesOrder={salesOrder!}
        canEdit={canEdit}
      />

      <div className='top-carrot'>
        <Tooltip title='Return to previous page' enterDelay={300}>
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
            <Paper elevation={3} className='sales-action-card '>
              {salesOrder?.platformType === PlatformType.B2B &&
              salesOrder?.orderStatus === OrderStatus.PREPARING ? (
                <OrderInfoEditGrid
                  salesOrder={salesOrder!}
                  setSalesOrder={setSalesOrder}
                />
              ) : (
                <OrderInfoGrid salesOrder={salesOrder!} />
              )}

              <div className='action-box'>
                <Typography sx={{ fontSize: 'inherit' }}>
                  Next Action:
                </Typography>

                <Tooltip
                  title={
                    salesOrder?.platformType === PlatformType.SHOPEE
                      ? 'Delivery handled by the eCommerce platform'
                      : statusStepper[activeStep].tooltip
                  }
                  enterDelay={500}
                >
                  <span>
                    <Button
                      variant='contained'
                      size='medium'
                      onClick={nextStep}
                      disabled={
                        ((salesOrder?.platformType === PlatformType.SHOPEE ||
                          salesOrder?.platformType === PlatformType.LAZADA) &&
                          activeStep > 2) ||
                        salesOrder?.orderStatus === OrderStatus.CANCELLED
                      }
                    >
                      {statusStepper[activeStep].nextAction}
                    </Button>
                  </span>
                </Tooltip>
              </div>
            </Paper>
          </div>

          <Paper elevation={3}>
            <div className='sales-content-body'>
              <div className='grid-toolbar'>
                <h4>Order ID: #{salesOrder?.orderId}</h4>
                {canEdit && (
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
                loading={loading}
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
