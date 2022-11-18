import NumberCard from '../../common/NumberCard';

type OrdersCardProps = {
  avgOrderNum: number;
};

const AverageOrderNumber = ({ avgOrderNum }: OrdersCardProps) => {

  return (
    <NumberCard
      value={avgOrderNum.toFixed(2)}
      text={`Average number of orders`}
    />
  );
};

export default AverageOrderNumber;
