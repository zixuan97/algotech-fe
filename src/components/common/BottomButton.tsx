import {
    Button,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface props {
    location: string,
    firstButtonText: string,
    secondButtonText: string,
    secondButtonFn: Function
}

const BottomButton: React.FC<props> = ({location, firstButtonText, secondButtonText, secondButtonFn}) => {
    const navigate = useNavigate();
    return (
        <div className='view-button-group'>
            <Button
                type='submit'
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
                type='submit'
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={(e) => secondButtonFn(e)}
            >
                {secondButtonText}
            </Button>
        </div>

    );
};

export default BottomButton;
