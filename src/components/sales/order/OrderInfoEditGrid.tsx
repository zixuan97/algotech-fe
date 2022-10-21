import { Grid, TextField } from '@mui/material';
import React from 'react';
import { SalesOrder } from 'src/models/types';
import PlatformChip from './PlatformChip';

interface props {
  salesOrder: SalesOrder;
  setSalesOrder: (salesOrder: any) => void;
}

const OrderInfoEditGrid = ({ salesOrder, setSalesOrder }: props) => {
  const salesOrderFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setSalesOrder((paramSalesOrder: any) => {
      return {
        ...paramSalesOrder!,
        [key]: event.target.value
      };
    });
  };

  return (
    <div className='order-info-grid'>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <TextField
            fullWidth
            required
            size="small"
            id='outlined-quantity'
            label='Customer Name'
            name='customerName'
            placeholder='eg.: John Tan'
            value={salesOrder.customerName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              salesOrderFieldChange(e, 'customerName')
            }
          />
        </Grid>

        <Grid item xs={7}>
          <TextField
            fullWidth
            required
            size="small"
            id='outlined-quantity'
            label='Contact No'
            name='customerContactNo'
            placeholder='eg.: Tan'
            error={!salesOrder?.customerContactNo}
            helperText={
              !salesOrder?.customerContactNo ? 'Contact Number is empty!' : ''
            }
            value={salesOrder?.customerContactNo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              salesOrderFieldChange(e, 'customerContactNo')
            }
          />
        </Grid>
        <Grid item xs={7}>
          <TextField
            fullWidth
            size="small"
            id='outlined-quantity'
            label='Email'
            name='customerEmail'
            placeholder='eg.: johntan@gmail.com'
            value={salesOrder?.customerEmail!}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              salesOrderFieldChange(e, 'customerEmail')
            }
          />
        </Grid>
        <Grid item xs={7}>
          <TextField
            fullWidth
            required
            size="small"
            id='outlined-quantity'
            label='Shipping Address'
            name='customerAddress'
            placeholder='eg.: Tan'
            error={!salesOrder?.customerAddress}
            helperText={
              !salesOrder?.customerAddress ? 'Shipping Address is empty!' : ''
            }
            value={salesOrder?.customerAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              salesOrderFieldChange(e, 'customerAddress')
            }
          />
        </Grid>
        <Grid item xs={7}>
          <TextField
            fullWidth
            size="small"
            id='outlined-quantity'
            label='Customer Comments'
            name='customerRemarks'
            placeholder='eg.: No spicy ones, thanks'
            value={salesOrder?.customerRemarks ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              salesOrderFieldChange(e, 'customerRemarks')
            }
          />
        </Grid>
      </Grid>
      <PlatformChip salesOrder={salesOrder!} />
    </div>
  );
};

export default OrderInfoEditGrid;
