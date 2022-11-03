import { ChevronLeft } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip
} from '@mui/material';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  BulkOrder,
  BulkOrderStatus,
  OrderStatus,
  SalesOrder
} from 'src/models/types';
import CustomerInfoGrid from 'src/components/sales/bulkOrder/CustomerInfoGrid';
import BulkOrderSummary from 'src/components/sales/bulkOrder/BulkOrderSummary';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  bulkOrderMassUpdate,
  getBulkOrderByIdSvc
} from 'src/services/bulkOrderService';
import { bulkOrderLineItems } from 'src/components/sales/bulkOrder/bulkOrderGridCol';
import { DataGrid } from '@mui/x-data-grid';
import BulkOrderStepper from 'src/components/sales/bulkOrder/BulkOrderStepper';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import BulkOrderActionButton from 'src/components/sales/bulkOrder/BulkOrderActionButton';

const title = 'Bulk prepare order items';
const body =
  'Are you sure you want to bulk prepare the order items in this bulk order? Once updated, there is no reversing the state.';

const BulkOrderDetails = () => {
  const navigate = useNavigate();
  let params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const [bulkOrder, setBulkOrder] = useState<BulkOrder>();
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [canBulkPrep, setCanBulkPrep] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(
        getBulkOrderByIdSvc(id),
        (bo: BulkOrder) => {
          setBulkOrder(bo);
          setSalesOrders(bo.salesOrders);
          if (
            bo.salesOrders.some(
              (order) => order.orderStatus === OrderStatus.PAID
            ) &&
            bo.bulkOrderStatus === BulkOrderStatus.PAYMENT_SUCCESS
          ) {
            setCanBulkPrep(true);
          }
          setLoading(false);
        },
        () => {
          setAlert({
            severity: 'error',
            message: 'Sales Order does not exist. You will be redirected back.'
          });
          setLoading(false);
          setTimeout(() => navigate(-1), 3500);
        }
      );
    }
  }, [id, navigate]);

  const bulkOrderPrep = () => {
    setLoading(true);
    asyncFetchCallback(
      bulkOrderMassUpdate(
        bulkOrder?.id!,
        bulkOrder?.bulkOrderStatus!,
        OrderStatus.PREPARED
      ),
      () => {
        setBulkOrder({
          ...bulkOrder!,
          salesOrders: salesOrders.map((so) => {
            return { ...so, orderStatus: OrderStatus.PREPARED };
          })
        });
        setCanBulkPrep(false);
        setAlert({
          severity: 'success',
          message: 'The orders in this bulk order has been updated.'
        });
      },
      () => {
        setAlert({
          severity: 'error',
          message:
            'Failed to update the orders in this bulk order. Contact the admin.'
        });
      }
    );
    setLoading(false);
    setModalOpen(false);
  };

  return (
    <>
      <ConfirmationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onConfirm={() => bulkOrderPrep()}
        title={title}
        body={body}
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
            <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
            <div className='bulk-order-header-title'>
              <h1>Bulk Order Details</h1>
            </div>

            {bulkOrder && (
              <BulkOrderStepper bulkOrderStatus={bulkOrder.bulkOrderStatus} />
            )}

            <Paper elevation={3} className='sales-action-card '>
              {loading ? (
                <div className='container-center'>
                  <CircularProgress color='secondary' />
                </div>
              ) : (
                bulkOrder && (
                  <>
                    <CustomerInfoGrid bulkOrder={bulkOrder!} />
                    <BulkOrderActionButton
                      bulkOrder={bulkOrder}
                      canBulkPrep={canBulkPrep}
                      setBulkOrder={setBulkOrder}
                      setCanBulkPrep={setCanBulkPrep}
                      setAlert={setAlert}
                    />
                  </>
                )
              )}
            </Paper>
          </div>

          <Paper elevation={3}>
            <div className='sales-content-body'>
              <div className='grid-toolbar'>
                <h3>Order ID: #{bulkOrder?.orderId}</h3>
                {canBulkPrep && (
                  <div className='button-group'>
                    <Button
                      variant='contained'
                      size='medium'
                      onClick={() => {
                        setModalOpen(true);
                      }}
                    >
                      Bulk Prepare
                    </Button>
                  </div>
                )}
              </div>
              {bulkOrder && (
                <>
                  <DataGrid
                    style={{ wordWrap: 'break-word' }}
                    columns={bulkOrderLineItems}
                    rows={bulkOrder.salesOrders}
                    autoHeight
                    pageSize={5}
                    loading={loading}
                  />
                  <BulkOrderSummary bulkOrder={bulkOrder!} />
                </>
              )}
            </div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default BulkOrderDetails;
