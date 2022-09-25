import { OrderStatus } from "src/models/types"
import {
    ReceiptLongRounded,
    AccountBalanceWalletRounded,
    PlaylistAddCheckCircleRounded,
    LocalShippingRounded,
    TaskAltRounded,
    AddShoppingCart
  } from '@mui/icons-material';


export const steps = [
  {
    currentState: OrderStatus.CREATED,
    label: 'Order Placed',
    icon: <ReceiptLongRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Confirm Payment'
  },
  {
    currentState: OrderStatus.PAID,
    label: 'Order Paid',
    icon: <AccountBalanceWalletRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Begin Prep'
  },
  {
    currentState: OrderStatus.PREPARING,
    label: 'Preparing Order',
    icon: <AddShoppingCart sx={{ fontSize: 35 }} />,
    nextAction: 'Complete Prep'
  },
  {
    currentState: OrderStatus.PREPARED,
    label: 'Order Prepared',
    icon: <PlaylistAddCheckCircleRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Schedule Delivery'
  },
  {
    currentState: OrderStatus.READY_FOR_DELIVERY,
    label: 'Delivery Scheduled',
    icon: <PlaylistAddCheckCircleRounded sx={{ fontSize: 35 }} />,
    nextAction: 'Confirm Pickup'
  },
  {
    currentState: OrderStatus.SHIPPED,
    label: 'Order Shipped',
    icon: <LocalShippingRounded sx={{ fontSize: 35 }} />,
    nextAction: 'View Delivery'
  },
  {
    currentState: OrderStatus.COMPLETED,
    label: 'Order Received',
    icon: <TaskAltRounded sx={{ fontSize: 35 }} />,
    nextAction: 'View Delivery'
  }
];
