import { Chip, Typography } from '@mui/material';
import _ from 'lodash';
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
        label={_.startCase(salesOrder?.platformType.toLowerCase())}
        sx={{
          bgcolor:
            salesOrder?.platformType === PlatformType.SHOPEE
              ? '#FFB46F'
              : salesOrder?.platformType === PlatformType.SHOPIFY
              ? '#C6D68F'
              : salesOrder?.platformType === PlatformType.B2B
              ? '#CDCDFF'
              : '#D9D9D9',
          color: 'primary'
        }}
      />
    </div>
  );
};

export default PlatformChip;
