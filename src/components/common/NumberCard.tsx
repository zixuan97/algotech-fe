import { Card } from '@mui/material';
import '../../styles/common/common.scss';

type NumberCardProps = {
  value: number | string;
  text: string;
  component?: React.ReactNode;
};

const NumberCard = ({ value, text, component }: NumberCardProps) => {
  return (
    <Card className='number-card' style={{minHeight: '18vh'}}>
      <div style={{ paddingRight: '5em' }}>
        <h1>{value}</h1>
        {text}
      </div>
      {component && component}
    </Card>
  );
};

export default NumberCard;
