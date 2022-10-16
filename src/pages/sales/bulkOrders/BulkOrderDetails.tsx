import { ChevronLeft } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { BulkOrder, BulkOrderStatus, SalesOrder } from 'src/models/types';
import CustomerInfoGrid from 'src/components/sales/bulkOrder/CustomerInfoGrid';
import BulkOrderSummary from 'src/components/sales/bulkOrder/BulkOrderSummary';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getBulkOrderByIdSvc } from 'src/services/bulkOrderService';
import { bulkOrderLineItems } from 'src/components/sales/bulkOrder/bulkOrderGridCol';
import { DataGrid } from '@mui/x-data-grid';
import BulkOrderStepper from 'src/components/sales/bulkOrder/BulkOrderStepper';
import { bulkOrderSteps } from 'src/components/sales/bulkOrder/bulkOrderSteps';

const BulkOrderDetails = () => {
  const navigate = useNavigate();
  let params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const [bulkOrder, setBulkOrder] = useState<BulkOrder>();
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(getBulkOrderByIdSvc(id), (bo: BulkOrder) => {
        if (bo) {
          setBulkOrder(bo);
          setSalesOrders(bo.salesOrders);
          setLoading(false);
        } else {
          setAlert({
            severity: 'error',
            message: 'Sales Order does not exist. You will be redirected back.'
          });
          setLoading(false);
          setTimeout(() => navigate(-1), 3500);
        }
      });
    }
  }, [id, navigate]);

  const statusStepper = useMemo(
    () =>
      bulkOrder?.bulkOrderStatus === BulkOrderStatus.CANCELLED
        ? bulkOrderSteps.filter((step) => {
            return (
              step.currentState !== BulkOrderStatus.PAYMENT_SUCCESS &&
              step.currentState !== BulkOrderStatus.PAYMENT_FAILED
            );
          })
        : bulkOrder?.bulkOrderStatus === BulkOrderStatus.PAYMENT_FAILED
        ? bulkOrderSteps.filter((step) => {
            return (
              step.currentState !== BulkOrderStatus.CANCELLED &&
              step.currentState !== BulkOrderStatus.PAYMENT_SUCCESS
            );
          })
        : bulkOrderSteps.filter((step) => {
            return (
              step.currentState !== BulkOrderStatus.CANCELLED &&
              step.currentState !== BulkOrderStatus.PAYMENT_FAILED
            );
          }),
    [bulkOrder?.bulkOrderStatus]
  );

  return (
    <>
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
            <h1>Bulk Order Details</h1>
            <BulkOrderStepper bulkOrderStatus={bulkOrder?.bulkOrderStatus!} />
            <Paper elevation={3} className='sales-action-card '>
              {bulkOrder && <CustomerInfoGrid bulkOrder={bulkOrder!} />}
              <div className='action-box'>
                <Typography sx={{ fontSize: 'inherit' }}>
                  Next Action:
                </Typography>
                <span>
                  <Button
                    variant='contained'
                    size='medium'
                    disabled={
                      bulkOrder?.bulkOrderStatus ===
                        BulkOrderStatus.CANCELLED ||
                      bulkOrder?.bulkOrderStatus ===
                        BulkOrderStatus.PAYMENT_FAILED
                    }
                  >
                    {statusStepper[activeStep].nextAction}
                  </Button>
                </span>
              </div>
            </Paper>
          </div>

          <Paper elevation={3}>
            <div className='sales-content-body'>
              <div className='grid-toolbar'>
                <h3>Order Details</h3>
              </div>
              {bulkOrder && (
                <>
                  <DataGrid
                    style={{ wordWrap: 'break-word' }}
                    columns={bulkOrderLineItems}
                    rows={salesOrders ?? []}
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
