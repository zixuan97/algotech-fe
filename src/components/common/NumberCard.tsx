import React from 'react';
import { Card } from '@mui/material';
import '../../styles/common/common.scss';

type NumberCardProps = {
  number: number;
  text: string;
};

const NumberCard = ({ number, text }: NumberCardProps) => {
  return (
    <Card className='number-card'>
      <h1>{number}</h1>
      {text}
    </Card>
  );
};

export default NumberCard;
