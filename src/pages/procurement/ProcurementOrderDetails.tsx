import React from 'react';
import { useNavigate } from 'react-router';
import { Tooltip, IconButton, Paper } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import DisplayedField from 'src/components/common/DisplayedField';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSearchParams } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getProcurementOrderById } from 'src/services/procurementService';
import { ProcurementOrder, ProcurementOrderItem } from 'src/models/types';

const order = {
  order_id: '123456',
  order_date: '03/03/12 22:43',
  supplier: 'Popcorn Planet',
  payment_status: 'Paid',
  order_total: '10000',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam luctus lorem turpis, vitae cursus augue maximus ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
};

const columns: GridColDef[] = [
  { field: 'product_sku', headerName: 'SKU', flex: 1 },
  { field: 'product_name', headerName: 'Product Name', flex: 1 },
  { field: 'rate', headerName: 'Rate per Unit', flex: 1 },
  { field: 'quantity', headerName: 'Quantity', flex: 1 }
];

const data = [
  {
    id: 1,
    product_sku: '12345',
    product_name: 'Nasi Lemak Popcorn',
    rate: 5,
    quantity: 10000
  }
];

const ProcurementOrderDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [originalOrder, setOriginalOrder] = React.useState<ProcurementOrder>();
  const [originalOrderItems, setOriginalOrderItems] = React.useState<
    ProcurementOrderItem[]
  >([]);
  const [originalOrderDate, setOriginalOrderDate] = React.useState('');

  React.useEffect(() => {
    if (id) {
      asyncFetchCallback(getProcurementOrderById(id), (res) => {
        let currentDate = new Date(res.order_date);
        let stringOrderDate = currentDate.toDateString();
        setOriginalOrderDate(stringOrderDate);
        setOriginalOrderItems(res.proc_order_items);
        setOriginalOrder(res);
      });
    }
  }, [id]);

  return (
    <div className='view-order-details'>
      <div className='view-order-details-heading'>
        <Tooltip title='Return to Previous Page' enterDelay={300}>
          <IconButton size='large' onClick={() => navigate(-1)}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <h1>View Procurement Order</h1>
      </div>
      <div className='order-details-section'>
        <Paper elevation={2} className='order-details-paper'>
          <div className='horizontal-text-fields'>
            <DisplayedField label='Order ID' value={originalOrder?.id} />
            <DisplayedField label='Date' value={originalOrderDate} />
            <DisplayedField
              label='Supplier'
              value={originalOrder?.supplier_id}
            />
          </div>
          <div className='horizontal-text-fields-two'>
            <DisplayedField
              label='Payment Status'
              value={originalOrder?.payment_status}
            />
            <DisplayedField label='Order Total' value={order.order_total} />
          </div>
          <div className='horizontal-text-fields'>
            <DisplayedField
              label='Comments'
              value={originalOrder?.description}
            />
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
                  {(originalOrder?.fulfilment_status === 'ARRIVED' ||
                    originalOrder?.fulfilment_status === 'COMPLETED') && (
                    <TimelineDot color='primary' />
                  )}
                  <TimelineDot variant='outlined' />
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
                  {originalOrder?.fulfilment_status === 'COMPLETED' && (
                    <TimelineDot color='primary' />
                  )}
                  <TimelineDot variant='outlined' />
                </TimelineSeparator>
                <TimelineContent color='text.secondary'>
                  Shipment Verified
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </React.Fragment>
        </Paper>
      </div>
      <div className='data-table-section'>
        <h2>Order Items</h2>
        <DataGrid columns={columns} rows={data} autoHeight />
      </div>
    </div>
  );
};

export default ProcurementOrderDetails;
