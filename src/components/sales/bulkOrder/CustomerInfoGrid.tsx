import { Grid } from '@mui/material';
import React from 'react';
import { BulkOrder } from 'src/models/types';

interface props {
  bulkOrder: BulkOrder;
}

const CustomerInfoGrid = ({ bulkOrder }: props) => {
  return (
    <div className='order-info-grid'>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          Payee Name: {bulkOrder.payeeName}
        </Grid>
        <Grid item xs={12}>
          Email: {bulkOrder.payeeEmail ?? 'NA'}
        </Grid>
        <Grid item xs={12}>
          Customer Comments: {bulkOrder.payeeRemarks! ?? '-'}
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerInfoGrid;
