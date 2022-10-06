import { CircularProgress, Button } from '@mui/material';

interface props {
  loading: boolean;
  handleRejectButtonClick: ()=>void;
  handleApproveButtonClick:()=>void;
}

const AppRejButtonGrp = ({ loading, handleRejectButtonClick, handleApproveButtonClick }: props) => {
  return (
    <div className='button-group'>
      {loading && <CircularProgress color='secondary' />}
      <Button
        type='submit'
        variant='contained'
        className='create-btn'
        color='warning'
        onClick={handleRejectButtonClick}
      >
        Reject
      </Button>
      <Button
        type='submit'
        variant='contained'
        className='create-btn'
        color='primary'
        onClick={handleApproveButtonClick}
      >
        Approve
      </Button>
    </div>
  );
};

export default AppRejButtonGrp;
