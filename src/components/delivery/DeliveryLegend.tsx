import { Typography, Divider } from '@mui/material';
import React from 'react';
import assignedMarker from 'src/resources/components/delivery/assigned.png';
import unassignedMarker from 'src/resources/components/delivery/unassigned.png';
import currentMarker from 'src/resources/components/delivery/current.png';

const DeliveryLegend = () => {
  return (
    <div className='delivery-legend-container'>
      <img
        src={currentMarker}
        alt='myLocation'
        width={18}
        height={25}
        className='delivery-legend-image'
      />
      <Typography className='delivery-legend-typography'>
        : My Location
      </Typography>
      <Divider orientation='vertical' flexItem />
      <img
        src={unassignedMarker}
        alt='unassignedDeliveries'
        width={18}
        height={25}
        className='delivery-legend-image'
      />
      <Typography className='delivery-legend-typography'>
        : Unassigned Deliveries
      </Typography>
      <Divider orientation='vertical' flexItem />
      <img
        src={assignedMarker}
        alt='unassignedDeliveries'
        width={18}
        height={25}
        className='delivery-legend-image'
      />
      <Typography className='delivery-legend-typography'>
        : Assigned Deliveries
      </Typography>
    </div>
  );
};

export default DeliveryLegend;
