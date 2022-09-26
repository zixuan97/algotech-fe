import { Grid } from "@mui/material";

interface props {
    custName: string,
    contactNo: string,
    email: string,
    address: string
}

const OrderInfoGrid = ({ custName, contactNo, email, address }: props) => {
  return (
    <div className='order-info-grid'>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          Customer Name: {custName}
        </Grid>
        <Grid item xs={6}>
          Contact No.: {contactNo}
        </Grid>
        <Grid item xs={12}>
          Email: {email ?? 'NA'}
        </Grid>
        <Grid item xs={12}>
          Shipping Address: {address}
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderInfoGrid;
