import { Chip, Typography } from '@mui/material';
import { PlatformType, SalesOrder } from 'src/models/types';

interface props {
  salesOrder: SalesOrder;
  pretext?: string;
}

const PlatformChip = ({ salesOrder, pretext }: props) => {
  return (
    <div style={{ margin: '1%' }}>
      {pretext && <Typography>{pretext}</Typography>}
      <Chip
        label={salesOrder?.platformType}
        color={
          salesOrder?.platformType === PlatformType.SHOPEE
            ? 'warning'
            : salesOrder?.platformType === PlatformType.SHOPIFY
            ? 'primary'
            : 'info'
        }
      />
    </div>
  );
};

export default PlatformChip;
