import _ from 'lodash';
import { BulkOrder } from 'src/models/types';

interface props {
  bulkOrder: BulkOrder;
}

const BulkOrderSummary = ({ bulkOrder }: props) => {
  return (
    <div className='order-summary-card'>
      <div>
        <h5>Merchandising Total: ${bulkOrder.amount.toFixed(2)}</h5>
        <h5>Shipping: -</h5>
        <h5>No. Of Deliveries: {bulkOrder.salesOrders.length ?? 0}</h5>
        <h5>
          Payment Method:
          {_.startCase(bulkOrder.paymentMode.toString().toLowerCase())}
        </h5>
      </div>
    </div>
  );
};

export default BulkOrderSummary;
