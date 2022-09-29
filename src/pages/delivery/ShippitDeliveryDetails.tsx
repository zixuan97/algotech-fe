import React from 'react';
import { useNavigate } from 'react-router';
import { Tooltip, IconButton, Button } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useSearchParams } from 'react-router-dom';
import { trackShippitDeliveryOrder } from 'src/services/deliveryServices';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';

const ShippitDeliveryDetails = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(
        trackShippitDeliveryOrder(id),
        (res) => {
          console.log(res);
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [id]);

  return (
    <div className='view-delivery-details'>
      <div className='view-delivery-details-top-section'>
        <div className='delivery-details-section-header'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>View Shippit Delivery Order ID: #1</h1>
        </div>
        <div className='track-order-button-container'>
          <Button
            variant='contained'
            startIcon={<LocalShippingIcon />}
            href='https://app.staging.shippit.com/tracking/ppaotp4lkyf8n'
          >
            Track Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShippitDeliveryDetails;
