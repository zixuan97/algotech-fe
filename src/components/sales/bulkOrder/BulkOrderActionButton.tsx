import { Button } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import { AlertType } from 'src/components/common/TimeoutAlert';
import {
  BulkOrder,
  BulkOrderStatus,
  OrderStatus,
  SalesOrder
} from 'src/models/types';
import {
  bulkOrderMassUpdate,
  updateBulkOrderStatusSvc,
  updateBulkOrderSvc
} from 'src/services/bulkOrderService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { BulkOrderSteps } from './BulkOrderStepper';

interface props {
  bulkOrder: BulkOrder;
  canBulkPrep: boolean;
  setBulkOrder: (bukkOrder: BulkOrder) => void;
  setCanBulkPrep: (bool: boolean) => void;
  setAlert: (value: React.SetStateAction<AlertType | null>) => void;
}

const BulkOrderActionButton = ({
  bulkOrder,
  canBulkPrep,
  setBulkOrder,
  setCanBulkPrep,
  setAlert
}: props) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');

  useEffect(() => {
    setActiveStep(
      BulkOrderSteps.findIndex(
        (step) => bulkOrder.bulkOrderStatus === step.currentState
      )
    );
    if (
      bulkOrder.bulkOrderStatus === BulkOrderStatus.FULFILLED ||
      bulkOrder.bulkOrderStatus === BulkOrderStatus.CANCELLED ||
      bulkOrder.bulkOrderStatus === BulkOrderStatus.PAYMENT_FAILED ||
      (bulkOrder.bulkOrderStatus === BulkOrderStatus.PAYMENT_SUCCESS &&
        !bulkOrder.salesOrders.every((order) => {
          return order.orderStatus === OrderStatus.DELIVERED;
        }))
    ) {
      setDisableButton(true);
    }
    if (bulkOrder.bulkOrderStatus === BulkOrderStatus.CREATED) {
      setTitle('Cancel an order');
      setBody('Are you sure you want to cancel this order?');
    } else {
      setTitle('Complete an order');
      setBody('Are you sure you want to mark this order as completed?');
    }
  }, [bulkOrder.bulkOrderStatus, bulkOrder.salesOrders]);

  const handleButtonPress = () => {
    if (bulkOrder.bulkOrderStatus === BulkOrderStatus.CREATED) {
      cancelBulkOrder();
    } else if (bulkOrder.bulkOrderStatus === BulkOrderStatus.PAYMENT_SUCCESS) {
      fulfilBulkOrder();
    }
  };

  const cancelBulkOrder = () => {
    asyncFetchCallback(
      bulkOrderMassUpdate(bulkOrder.id, BulkOrderStatus.CANCELLED, OrderStatus.CANCELLED),
      () => {
        setBulkOrder({
          ...bulkOrder,
          bulkOrderStatus: BulkOrderStatus.CANCELLED,
          salesOrders: bulkOrder.salesOrders.map((so) => {
            return { ...so, orderStatus: OrderStatus.CANCELLED };
          })
        });
        setCanBulkPrep(false);
        setAlert({
          severity: 'success',
          message: 'This bulk order has been cancelled.'
        });
      },
      () => {
        setAlert({
          severity: 'error',
          message: 'Failed to cancel this bulk order. Contact the admin.'
        });
      }
    );
    setModalOpen(false);
  };

  const fulfilBulkOrder = () => {
    asyncFetchCallback(
      updateBulkOrderStatusSvc(bulkOrder?.id!, BulkOrderStatus.FULFILLED),
      () => {
        setBulkOrder({
          ...bulkOrder!,
          bulkOrderStatus: BulkOrderStatus.FULFILLED
        });
        setCanBulkPrep(false);
        setAlert({
          severity: 'success',
          message: 'The orders in this bulk order has been updated.'
        });
      },
      () => {
        setAlert({
          severity: 'error',
          message:
            'Failed to update the orders in this bulk order. Contact the admin.'
        });
      }
    );
    setModalOpen(false);
  }

  return (
    <>
      <ConfirmationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onConfirm={() => handleButtonPress()}
        title={title}
        body={body}
      />

      <Button
        variant='contained'
        color={
          bulkOrder.bulkOrderStatus === BulkOrderStatus.CREATED
            ? 'warning'
            : 'primary'
        }
        size='medium'
        disabled={disableButton || canBulkPrep}
        onClick={() => setModalOpen(true)}
      >
        {BulkOrderSteps[activeStep].altAction}
      </Button>
    </>
  );
};

export default BulkOrderActionButton;
