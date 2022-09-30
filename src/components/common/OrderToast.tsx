import { Button, Stack, Typography } from '@mui/material';
import { startCase } from 'lodash';
import { SalesOrder } from 'src/models/types';
import '../../styles/common/common.scss';

type OrderToastProps = {
  salesOrder: SalesOrder;
  navigate: (orderId: string) => void;
};

const OrderToast = ({ salesOrder, navigate }: OrderToastProps) => {
  const { orderId, platformType } = salesOrder;
  return (
    <div style={{ margin: '0.5em' }}>
      <Stack alignItems='flex-start' justifyContent='center' spacing={2}>
        <Typography>{`New order has come in from ${startCase(
          platformType.toLowerCase()
        )}!`}</Typography>
        <Typography>{`Order number: ${orderId}`}</Typography>
        <Button variant='contained' onClick={() => navigate(orderId)}>
          View Order Details
        </Button>
      </Stack>
    </div>
  );
};

export default OrderToast;
