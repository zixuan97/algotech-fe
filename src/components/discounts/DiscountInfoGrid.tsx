import { Divider, Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import _ from 'lodash';
import moment from 'moment';
import { DiscountCode, DiscountCodeType } from 'src/models/types';
import { DD_MM_YYYY } from 'src/utils/dateUtils';
import { customerEmailGridCol } from './DiscountOrderGridCol';

interface props {
  discountCode: DiscountCode;
  loading: boolean;
}

const DiscountInfoGrid = ({ discountCode, loading }: props) => {
  return (
    <>
      <Grid container spacing={1} style={{ marginBottom: '2%' }}>
        <Grid item xs={6}>
          <div>
            <h4>Discount Code</h4>
            <Typography>{discountCode.discountCode}</Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <h4>Discount Type</h4>
            <Typography>
              {_.startCase(discountCode.type.toString().toLowerCase())}
            </Typography>
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
            <Typography>{`$${discountCode.minOrderAmount}`}</Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <h4>Discount Period</h4>
            <Typography>
              {discountCode.endDate ? 'Fixed' : 'Recurring'}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <h4>Discount Date</h4>
            <Typography>
              {`${moment(discountCode.startDate).format(DD_MM_YYYY)} to ${
                discountCode.endDate && moment(discountCode.endDate).isValid()
                  ? moment(discountCode.endDate).format(DD_MM_YYYY)
                  : '-'
              }`}

              {/* {discountCode.endDate
                ? `${moment(discountCode.startDate).format(
                    DD_MM_YYYY
                  )} to ${moment(discountCode.endDate).format(DD_MM_YYYY)}`
                : moment(discountCode.startDate).format(DD_MM_YYYY)} */}
            </Typography>
          </div>
        </Grid>
      </Grid>

      <Divider style={{ marginBottom: '1%' }} />
      <h3>Allocated Emails</h3>
      <DataGrid
        columns={customerEmailGridCol}
        rows={discountCode.customerEmails}
        getRowId={(row) => discountCode.customerEmails.indexOf(row)}
        autoHeight
        loading={loading}
      />
    </>
  );
};

export default DiscountInfoGrid;
