import NumberCard from '../../common/NumberCard';

type OrdersCardProps = {
  avgOrderVal: number;
};

const AverageValueOrder = ({ avgOrderVal }: OrdersCardProps) => {
  return (
    <NumberCard
      value={`$${avgOrderVal.toFixed(2)}`}
      text={`Average Value Of Orders`}
    />
  );
};

export default AverageValueOrder;
