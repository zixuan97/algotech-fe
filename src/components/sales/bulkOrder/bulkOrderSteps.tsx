import { BulkOrderStatus } from "src/models/types"
import {
    ReceiptLongRounded,
    AccountBalanceWalletRounded,
    PlaylistAddCheckCircleRounded,
    DoDisturbOffRounded
  } from '@mui/icons-material';


export const bulkOrderSteps = [
  {
    currentState: BulkOrderStatus.CREATED,
    label: 'Order Placed',
    icon: <ReceiptLongRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Confirm Payment',
    tooltip: 'Confirm the payment for this order'
  },
  {
    currentState: BulkOrderStatus.CANCELLED,
    label: 'Order Cancelled',
    icon: <DoDisturbOffRounded sx={{ fontSize: 35 }} />,
    nextAction: 'No Further Actions',
    tooltip: 'Order has been cancelled, no further actions from your end'
  },
  {
    currentState: BulkOrderStatus.PAYMENT_FAILED,
    label: 'Payment Failed',
    icon: <AccountBalanceWalletRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Contact Admin',
    tooltip: 'Kindly seek admin assitance to retry payment'
  },
  {
    currentState: BulkOrderStatus.PAYMENT_SUCCESS,
    label: 'Order Paid',
    icon: <AccountBalanceWalletRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Bulk Prepare',
    tooltip: 'Bulk prepare the orders, otherwise individually prepare each order'
  },
  {
    currentState: BulkOrderStatus.FULFILLED,
    label: 'Order Fulfilled',
    icon: <PlaylistAddCheckCircleRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Back To All Bulk Order',
    tooltip: 'Order completed, no further actions from your end'
  },
];
