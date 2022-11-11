import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscountCode, DiscountCodeType } from 'src/models/types';

interface props {
  location: string;
  firstButtonText: string;
  secondButtonText: string;
  secondButtonFn: Function;
  discountCode: Partial<DiscountCode>;
  loading: boolean;
}

const BottomButton: React.FC<props> = ({
  location,
  firstButtonText,
  secondButtonText,
  secondButtonFn,
  discountCode,
  loading
}) => {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (
      !(
        discountCode.discountCode &&
        discountCode.amount &&
        discountCode.type &&
        discountCode.startDate &&
        discountCode.minOrderAmount
      ) ||
      (discountCode.type===DiscountCodeType.PERCENTAGE && discountCode.amount > 99)
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [discountCode]);

  return (
    <div className='view-button-group'>
      {loading && <CircularProgress color='secondary' />}
      <Button
        variant='contained'
        className='create-btn'
        color='primary'
        onClick={() => {
          navigate(`/${location}`);
        }}
      >
        {firstButtonText}
      </Button>
      <Button
        variant='contained'
        className='create-btn'
        color='primary'
        onClick={(e) => secondButtonFn(e)}
        disabled={isDisabled}
      >
        {secondButtonText}
      </Button>
    </div>
  );
};

export default BottomButton;
