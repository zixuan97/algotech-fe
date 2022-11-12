import React from 'react';
import { useNavigate } from 'react-router';
import {
  Tooltip,
  IconButton,
  Paper,
  Button,
  Backdrop,
  CircularProgress,
  TextField,
  MenuItem
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import DisplayedField from 'src/components/common/DisplayedField';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridColumnHeaderParams
} from '@mui/x-data-grid';
import { useSearchParams } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  editProcurementOrder,
  getProcurementOrderById
} from 'src/services/procurementService';
import { ProcurementOrder, ProcurementOrderItem } from 'src/models/types';
import { FulfilmentStatus } from 'src/models/types';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import apiRoot from 'src/services/util/apiRoot';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import moment from 'moment';

const paymentStatusOptions = [
  { id: 1, value: 'PAID' },
  { id: 2, value: 'PENDING' }
];

const ProcurementOrderDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [originalOrder, setOriginalOrder] = React.useState<ProcurementOrder>();
  const [updatedOrder, setUpdatedOrder] = React.useState<ProcurementOrder>();
  const [originalOrderItems, setOriginalOrderItems] = React.useState<
    ProcurementOrderItem[]
  >([]);
  const [originalOrderDate, setOriginalOrderDate] = React.useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [currency, setCurrency] = React.useState<string>('-');

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params.row.productSku
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params.row.productName
    },
    {
      field: 'rate',
      renderHeader: (params: GridColumnHeaderParams) => (
        <div style={{ fontWeight: '500' }}>{`Rate per Unit (${
          currency.split(' - ')[0]
        })`}</div>
      ),
      flex: 1
    },
    { field: 'quantity', headerName: 'Quantity', flex: 1 }
  ];

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(
        getProcurementOrderById(id),
        (res) => {
          let currentDate = new Date(res.orderDate);
          let stringOrderDate = currentDate.toDateString();
          setOriginalOrderDate(stringOrderDate);
          setOriginalOrderItems(res.procOrderItems);
          setOriginalOrder(res);
          setUpdatedOrder(res);
          setLoading(false);
          console.log(res.supplier);
          setCurrency(res.supplier.currency);
        },
        () => setLoading(false)
      );
    }
  }, [id]);

  const handleDownloadInvoice = async () => {
    if (id) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', `${apiRoot}/procurement/pdf/${id}`, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
        if (this.status == 200) {
          var blob = new Blob([this.response], {
            type: 'application/pdf'
          });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          let orderDate = moment(originalOrder?.orderDate).format('DDMMYYYY');
          link.download = `PurchaseOrder-${originalOrder?.supplier.name}-${orderDate}`;
          link.click();
        }
      };
      xhr.send();
    }
  };

  const handleEditProcurementOrder = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await setUpdatedOrder((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleCancelUpdate = async () => {
    setEdit(false);
    setUpdatedOrder(originalOrder);
  };

  const handleOrderStatusUpdate = async () => {
    setLoading(true);

    let reqBody = {
      id: Number(originalOrder?.id),
      description: originalOrder?.description,
      paymentStatus: originalOrder?.paymentStatus,
      supplierId: originalOrder?.supplier.id,
      fulfilmentStatus:
        originalOrder?.fulfilmentStatus === FulfilmentStatus.CREATED
          ? FulfilmentStatus.ARRIVED
          : FulfilmentStatus.COMPLETED
    };

    await asyncFetchCallback(
      editProcurementOrder(reqBody),
      (res) => {
        setOriginalOrder((originalOrder) => {
          if (originalOrder) {
            return {
              ...originalOrder,
              fulfilmentStatus:
                originalOrder?.fulfilmentStatus === FulfilmentStatus.CREATED
                  ? FulfilmentStatus.ARRIVED
                  : FulfilmentStatus.COMPLETED
            };
          } else {
            return originalOrder;
          }
        });
        setAlert({
          severity: 'success',
          message: 'Fulfilment Status updated successfully.'
        });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message: 'Fulfilment Status was not updated successfully.'
        });
      }
    );
  };

  const handleOrderUpdate = async () => {
    setLoading(true);

    let reqBody = {
      id: Number(originalOrder?.id),
      description: updatedOrder?.description,
      paymentStatus: updatedOrder?.paymentStatus,
      fulfilmentStatus: originalOrder?.fulfilmentStatus,
      supplierId: originalOrder?.supplier.id
    };

    await asyncFetchCallback(
      editProcurementOrder(reqBody),
      (res) => {
        setOriginalOrder((originalOrder) => {
          if (originalOrder) {
            return {
              ...originalOrder,
              paymentStatus: updatedOrder!.paymentStatus,
              description: updatedOrder!.description
            };
          } else {
            return originalOrder;
          }
        });
        setAlert({
          severity: 'success',
          message: 'Procurement Order updated successfully.'
        });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message: 'Procurement Order was not updated successfully.'
        });
      }
    );
  };

  return (
    <div className='view-order-details'>
      <div className='view-order-details-heading'>
        <div className='section-header'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>View Procurement Order ID: #{originalOrder?.id}</h1>
        </div>
        <div className='view-details-button-container'>
          <Button
            variant='contained'
            onClick={() => {
              if (!edit) {
                setEdit(true);
              } else {
                handleOrderUpdate();
                setEdit(false);
              }
            }}
          >
            {edit ? 'Save Changes' : 'Edit'}
          </Button>
          {edit && (
            <Button
              variant='contained'
              size='medium'
              sx={{ width: 'fit-content' }}
              onClick={handleCancelUpdate}
            >
              Cancel
            </Button>
          )}
        </div>
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
      {alert && (
        <div className='alert'>
          <TimeoutAlert
            alert={alert}
            timeout={6000}
            clearAlert={() => setAlert(null)}
          />
        </div>
      )}
      <div className='order-details-section'>
        <Paper elevation={2} className='order-details-paper'>
          <div className='horizontal-text-fields'>
            <DisplayedField label='Order ID' value={originalOrder?.id} />
            <DisplayedField label='Date' value={originalOrderDate} />
            <DisplayedField
              label='Supplier'
              value={originalOrder?.supplier!.name}
            />
          </div>
          <div className='horizontal-text-fields-two'>
            {edit ? (
              <div
                style={{
                  width: '50%',
                  padding: '2rem',
                  paddingBottom: '0'
                }}
              >
                <TextField
                  id='payment-status-select-label'
                  label='Payment Status'
                  name='paymentStatus'
                  value={updatedOrder?.paymentStatus}
                  onChange={handleEditProcurementOrder}
                  select
                  fullWidth
                >
                  {paymentStatusOptions.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            ) : (
              <DisplayedField
                label='Payment Status'
                value={originalOrder?.paymentStatus}
              />
            )}
            <DisplayedField
              label='Order Total'
              value={
                currency.split(' - ')[0] + ' ' + originalOrder?.totalAmount
              }
            />
          </div>
          <div className='horizontal-text-fields'>
            {edit ? (
              <div
                style={{
                  flexDirection: 'column',
                  padding: '2rem',
                  paddingBottom: '0'
                }}
              >
                <TextField
                  id='outlined-required'
                  label='Comments'
                  name='description'
                  value={updatedOrder?.description}
                  onChange={handleEditProcurementOrder}
                  placeholder='Enter updated comments here.'
                  fullWidth
                  multiline
                  maxRows={4}
                />
              </div>
            ) : (
              <DisplayedField
                label='Comments'
                value={originalOrder?.description}
              />
            )}
          </div>
          <div className='horizontal-text-fields'>
            <DisplayedField label='Purchase Order Invoice' value='' />
          </div>
          <div
            style={{
              paddingLeft: '3rem',
              paddingBottom: '0'
            }}
          >
            <Button
              variant='outlined'
              startIcon={<PictureAsPdfIcon />}
              onClick={handleDownloadInvoice}
            >
              PurchaseOrder-{originalOrder?.supplier.name}-
              {moment(originalOrder?.orderDate).format('DDMMYYYY')}
              .pdf
            </Button>
          </div>
        </Paper>
        <Paper elevation={2} className='order-details-paper'>
          <h3>View Order Status</h3>
          <React.Fragment>
            <Timeline>
              <TimelineItem>
                <TimelineOppositeContent color='text.primary'>
                  Order Created
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color='primary' />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent color='text.secondary'>
                  Order Sent
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color='text.primary'>
                  Order Arrived
                </TimelineOppositeContent>
                <TimelineSeparator>
                  {(originalOrder?.fulfilmentStatus === 'ARRIVED' ||
                    originalOrder?.fulfilmentStatus === 'COMPLETED') && (
                    <TimelineDot color='primary' />
                  )}
                  {originalOrder?.fulfilmentStatus === 'CREATED' && (
                    <TimelineDot variant='outlined' />
                  )}
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent color='text.secondary'>
                  Shipment Delivered
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color='text.primary'>
                  Order Completed
                </TimelineOppositeContent>
                <TimelineSeparator>
                  {originalOrder?.fulfilmentStatus ===
                    FulfilmentStatus.COMPLETED && (
                    <TimelineDot color='primary' />
                  )}
                  {originalOrder?.fulfilmentStatus !==
                    FulfilmentStatus.COMPLETED && (
                    <TimelineDot variant='outlined' />
                  )}
                </TimelineSeparator>
                <TimelineContent color='text.secondary'>
                  Shipment Verified
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </React.Fragment>
          <div className='status-button-container'>
            {originalOrder?.fulfilmentStatus !== FulfilmentStatus.COMPLETED && (
              <Button
                variant='contained'
                size='medium'
                sx={{ width: 'fit-content' }}
                onClick={handleOrderStatusUpdate}
              >
                {originalOrder?.fulfilmentStatus === FulfilmentStatus.CREATED
                  ? 'Order Arrived'
                  : 'Order Completed'}
              </Button>
            )}
          </div>
        </Paper>
      </div>
      <div className='data-table-section'>
        <h2>Order Items</h2>
        <DataGrid
          columns={columns}
          rows={originalOrderItems}
          getRowId={(row) => row.productSku}
          autoHeight
        />
      </div>
    </div>
  );
};

export default ProcurementOrderDetails;
