import { Grid } from "@mui/material";
import React from "react";
import { SalesOrder } from "src/models/types";

interface props {
    salesOrder: SalesOrder
}

const OrderInfoGrid = ({ salesOrder }: props) => {

  return (
    <div className='order-info-grid'>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          Customer Name: {salesOrder?.customerName!}
        </Grid>
        <Grid item xs={6}>
          Contact No.: {salesOrder?.customerContactNo!}
        </Grid>
        <Grid item xs={12}>
          Email: {salesOrder?.customerEmail ?? 'NA'}
        </Grid>
        <Grid item xs={12}>
          Shipping Address: {salesOrder?.customerAddress!}
        </Grid>
        <Grid item xs={12}>
          Customer Comments: {salesOrder?.customerRemarks! ?? '-'}
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderInfoGrid;
