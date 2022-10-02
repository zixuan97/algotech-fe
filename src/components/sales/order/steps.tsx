import { OrderStatus } from "src/models/types"
import {
    ReceiptLongRounded,
    AccountBalanceWalletRounded,
    PlaylistAddCheckCircleRounded,
    LocalShippingRounded,
    TaskAltRounded,
    AddShoppingCart,
    DepartureBoardRounded,
    DoDisturbOffRounded
  } from '@mui/icons-material';


export const steps = [
  {
    currentState: OrderStatus.CREATED,
    label: 'Order Placed',
    icon: <ReceiptLongRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Confirm Payment',
    tooltip: 'Confirm the payment for this order'
  },
  {
    currentState: OrderStatus.CANCELLED,
    label: 'Order Cancelled',
    icon: <DoDisturbOffRounded sx={{ fontSize: 35 }} />,
    nextAction: 'No Further Actions',
    tooltip: 'Order has been cancelled, no further actions from your end'
  },
  {
    currentState: OrderStatus.PAID,
    label: 'Order Paid',
    icon: <AccountBalanceWalletRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Begin Prep',
    tooltip: 'Begin the preparation for this order'
  },
  {
    currentState: OrderStatus.PREPARING,
    label: 'Preparing Order',
    icon: <AddShoppingCart sx={{ fontSize: 35 }} />,
    nextAction: 'Complete Prep',
    tooltip: 'Complete the preparation for this order'
  },
  {
    currentState: OrderStatus.PREPARED,
    label: 'Order Prepared',
    icon: <PlaylistAddCheckCircleRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Schedule Delivery',
    tooltip: 'Schedule a Manual or Shippit delivery for this order'
  },
  {
    currentState: OrderStatus.READY_FOR_DELIVERY,
    label: 'Delivery Scheduled',
    icon: <DepartureBoardRounded sx={{ fontSize: 35 }} />,
    nextAction: 'View Delivery Details',
    tooltip: 'View delivery details for this order'
  },
  {
    currentState: OrderStatus.SHIPPED,
    label: 'Order Shipped',
    icon: <LocalShippingRounded sx={{ fontSize: 35 }} />,
    nextAction: 'View Delivery Details',
    tooltip: 'View delivery details for this order'
  },
  {
    currentState: OrderStatus.COMPLETED || 'DELIVERED',
    label: 'Order Received',
    icon: <TaskAltRounded sx={{ fontSize: 35 }} />,
    nextAction: 'View Delivery Details',
    tooltip: 'View delivery details for this order'
  }
];
