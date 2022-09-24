import { Typography } from '@mui/material';
import '../styles/common/common.scss';

const NotFound = () => {
  return (
    <div className='container-center-padding'>
      <Typography sx={{ fontSize: 20 }}>
        404: The page you are trying to look for cannot be found
      </Typography>
      <h1 style={{ paddingLeft: 5 }}>
        <span role='img' aria-label='sad'>
          😔
        </span>
      </h1>
    </div>
  );
};

export default NotFound;
