import { Chip, Typography } from '@mui/material';
import _ from 'lodash';
import { PaymentMode, BulkOrder } from 'src/models/types';

interface props {
  bulkOrder: BulkOrder;
  pretext?: string;
}

const PaymentChip = ({ bulkOrder, pretext }: props) => {
  return (
    <div style={{ margin: '1%' }}>
      {pretext && <Typography>{pretext}</Typography>}
      <Chip
        label={_.startCase(bulkOrder?.paymentMode.toLowerCase())}
        sx={{
          bgcolor:
            bulkOrder?.paymentMode === PaymentMode.CREDIT_CARD
              ? '#FFB46F'
              : bulkOrder?.paymentMode === PaymentMode.BANK_TRANSFER
              ? '#C6D68F'
              : '#D9D9D9',
          color: 'primary'
        }}
      />
    </div>
  );
};

export default PaymentChip;
