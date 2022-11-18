import { CircularProgress, Button } from '@mui/material';
import { useState } from 'react';
import { User, UserStatus } from 'src/models/types';
import {
  deleteUserSvc,
  disableUserSvc,
  editUserSvc,
  enableUserSvc
} from 'src/services/accountService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import validator from 'validator';
import ConfirmationModal from '../common/ConfirmationModal';
import { AlertType } from '../common/TimeoutAlert';
import { useNavigate } from 'react-router-dom';

interface props {
  id: string;
  edit: boolean;
  loading: boolean;
  user: User;
  editUser: User;
  setEditUser: (user: User) => void;
  setUser: (user: any) => void;
  setEdit: (param: boolean) => void;
  setLoading: (loading: boolean) => void;
  setAlert: (alert: AlertType | null) => void;
  deletePath: string;
  viewPath: string;
}
interface modalParam {
  title: string;
  body: string;
  funct: () => void;
}

const AccountEditButtonGrp = ({
  id,
  loading,
  edit,
  user,
  editUser,
  setEditUser,
  setEdit,
  setLoading,
  setAlert,
  setUser,
  deletePath,
  viewPath
}: props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalParam, setModalParam] = useState<modalParam>({
    title: '',
    body: '',
    funct: () => {}
  });
  const navigate = useNavigate();

  const handleDisableButtonClick = () => {
    setModalOpen(true);
    setModalParam({
      title: 'Disable Account',
      body: 'Are you sure you want to disable this account?',
      funct: disableAccount
    });
  };

  const handleEnableButtonClick = () => {
    setModalOpen(true);
    setModalParam({
      title: 'Enable Account',
      body: 'Are you sure you want to enable this account?',
      funct: enableAccount
    });
  };

  const handleDeleteButtonClick = () => {
    setModalOpen(true);
    setModalParam({
      title: 'Delete Account',
      body: 'Are you sure you want to delete this account?',
      funct: deleteAccount
    });
  };

  const deleteAccount = () => {
    setModalOpen(false);
    id &&
      asyncFetchCallback(
        deleteUserSvc(id),
        () => {
          setAlert({
            severity: 'success',
            message:
              'Account deleted. You will be redirected back to the Accounts page.'
          });
          setModalOpen(false);
          setTimeout(() => navigate(`${deletePath}`), 3500);
        },
        () => {
          setModalOpen(false);
          setAlert({
            severity: 'error',
            message: 'Cannot delete user at this point. Try again later.'
          });
        }
      );
  };

  const disableAccount = () => {
    id &&
      asyncFetchCallback(disableUserSvc(id), () => {
        setAlert({
          severity: 'warning',
          message: 'Account disabled.'
        });
        setModalOpen(false);
        navigate(`${viewPath}?id=${id}`);
        setUser((oldUser: User) => {
          return {
            ...oldUser!,
            status: UserStatus.DISABLED
          };
        });
      });
    setModalOpen(false);
  };

  const enableAccount = () => {
    id &&
      asyncFetchCallback(enableUserSvc(id), () => {
        setAlert({
          severity: 'success',
          message: 'Account enabled.'
        });
        setModalOpen(false);
        navigate(`${viewPath}?id=${id}`);
        setUser((oldUser: User) => {
          return {
            ...oldUser!,
            status: UserStatus.ACTIVE
          };
        });
      });
    setModalOpen(false);
  };

  const handleSaveButtonClick = (e: any) => {
    e.preventDefault();
    setLoading(true);
    asyncFetchCallback(
      editUserSvc(editUser!),
      () => {
        setAlert({
          severity: 'success',
          message: 'Account edited.'
        });
        setLoading(false);
        setUser(editUser);
      },
      () => {
        setAlert({
          severity: 'error',
          message: 'Error saving changes for account! Try again later.'
        });
        setLoading(false);
      }
    );
  };

  return (
    <>
      <ConfirmationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onConfirm={modalParam.funct}
        title={modalParam.title}
        body={modalParam.body}
      />

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
            Discard Changes
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
          {edit ? 'Save Changes' : 'Edit'}
        </Button>
        {!edit && (
          <Button
            type='submit'
            variant='contained'
            className='create-btn'
            color='primary'
            onClick={handleDeleteButtonClick}
          >
            Delete
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
            {user?.status === 'ACTIVE' ? 'Disable' : 'Enable'}
          </Button>
        )}
      </div>
    </>
  );
};

export default AccountEditButtonGrp;
