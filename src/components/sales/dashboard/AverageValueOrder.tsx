import { MomentRange, READABLE_DDMMYY } from 'src/utils/dateUtils';
import NumberCard from '../../common/NumberCard';

type OrdersCardProps = {
  avgOrderVal: number;
  dateRange: MomentRange;
};

const AverageValueOrder = ({ avgOrderVal, dateRange }: OrdersCardProps) => {
  return (
    <NumberCard
      value={`$${avgOrderVal.toFixed(2)}`}
      text={`Average value per order from ${dateRange[0].format(
        READABLE_DDMMYY
      )} to ${dateRange[1].format(READABLE_DDMMYY)}`}
    />
  );
};

export default AverageValueOrder;
