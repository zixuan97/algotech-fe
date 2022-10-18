import { Grid } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { BulkOrder } from 'src/models/types';
import { READABLE_DDMMYY_TIME } from 'src/utils/dateUtils';

interface props {
  bulkOrder: BulkOrder;
}

const CustomerInfoGrid = ({ bulkOrder }: props) => {
  return (
    <div className='order-info-grid'>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          Bulk Order For: {bulkOrder.payeeName}
        </Grid>
        <Grid item xs={12}>
          Email: {bulkOrder.payeeEmail ?? 'NA'}
        </Grid>
        <Grid item xs={12}>
          Contact No: {bulkOrder.payeeContactNo ?? '-'}
        </Grid>
        <Grid item xs={12}>
          Ordered On: {moment(bulkOrder.createdTime).format(READABLE_DDMMYY_TIME)}
        </Grid>
        <Grid item xs={12}>
          Customer Comments: {bulkOrder.payeeRemarks! ?? '-'}
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerInfoGrid;
