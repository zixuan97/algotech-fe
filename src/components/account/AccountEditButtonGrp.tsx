import { CircularProgress, Button } from '@mui/material';
import { User } from 'src/models/types';
import validator from 'validator';

interface props {
  edit: boolean;
  loading: boolean;
  user: User;
  editUser: User;
  handleDeleteButtonClick: ()=> void;
  handleDisableButtonClick: ()=> void;
  handleEnableButtonClick: ()=> void;
  setEditUser: (user: User) => void;
  setEdit: (param: boolean) => void;
  handleSaveButtonClick: (e: any) => void;
}

const AccountEditButtonGrp = ({
  loading,
  edit,
  user,
  editUser,
  handleDeleteButtonClick,
  handleDisableButtonClick,
  handleEnableButtonClick,
  setEditUser,
  setEdit,
  handleSaveButtonClick
}: props) => {
  return (
    <div className='button-group'>
      {loading && <CircularProgress color='secondary' />}
      {edit && (
        <Button
          variant='contained'
          className='create-btn'
          color='primary'
          onClick={() => {
            setEdit(false);
            setEditUser(user);
          }}
        >
          DISCARD CHANGES
        </Button>
      )}
      <Button
        variant='contained'
        className='create-btn'
        color='primary'
        disabled={
          edit &&
          (!validator.isEmail(editUser?.email!) ||
            validator.isEmpty(editUser?.lastName!) ||
            validator.isEmpty(editUser?.firstName!))
        }
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (!edit) {
            setEdit(true);
          } else {
            handleSaveButtonClick(e);
            setEdit(false);
          }
        }}
      >
        {edit ? 'SAVE CHANGES' : 'EDIT'}
      </Button>
      {!edit && (
        <Button
          type='submit'
          variant='contained'
          className='create-btn'
          color='primary'
          onClick={handleDeleteButtonClick}
        >
          DELETE
        </Button>
      )}

      {!edit && (
        <Button
          type='submit'
          variant='contained'
          className='create-btn'
          color='primary'
          onClick={
            user?.status === 'ACTIVE'
              ? handleDisableButtonClick
              : handleEnableButtonClick
          }
        >
          {user?.status === 'ACTIVE' ? 'DISABLE' : 'ENABLE'}
        </Button>
      )}
    </div>
  );
};

export default AccountEditButtonGrp;
