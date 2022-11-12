import { Grid, Typography } from '@mui/material';
import { DiscountCode, DiscountCodeType } from 'src/models/types';

interface props {
  discountCode: DiscountCode;
}

const DiscountInfoGrid = ({ discountCode }: props) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <div>
          <h4>Discount Code</h4>
          <Typography>{discountCode.discountCode}</Typography>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <h4>Discount Amount</h4>
          <Typography>
            {discountCode.type === DiscountCodeType.PERCENTAGE
              ? `${discountCode.amount}%`
              : `$${discountCode.amount}`}
          </Typography>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <h4>Minimum Order Amount</h4>
          <Typography>{discountCode.minOrderAmount}</Typography>
        </div>
      </Grid>
    </Grid>
  );
};

export default DiscountInfoGrid;
