import { PlatformType, SalesOrder } from 'src/models/types';

interface props {
  salesOrder: SalesOrder;
}

const OrderSummaryCard = ({ salesOrder }: props) => {
  return (
    <div className='order-summary-card'>
      <div>
        <h5>Merchandising Total: ${salesOrder?.amount.toFixed(2)}</h5>
        <h5>Shipping: -</h5>
        <h5>Order Subtotal: ${salesOrder?.amount.toFixed(2)}</h5>
        <h5>
          Payment Method:
          {salesOrder?.platformType === PlatformType.OTHERS
            ? ' PayNow'
            : ' On eCommerce'}
        </h5>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
