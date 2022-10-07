import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Grid,
  CircularProgress,
  Typography
} from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft } from '@mui/icons-material';
import {
  disableUserSvc,
  enableUserSvc,
  getUserDetailsSvc,
  rejectUserReqSvc,
  approveUserReqSvc,
  deleteUserSvc,
  editUserSvc
} from 'src/services/accountService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { User, UserStatus } from 'src/models/types';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import TimeoutAlert, { AlertType } from '../../components/common/TimeoutAlert';
import ApproveRejectButtonGrp from 'src/components/account/ApproveRejectButtonGrp';
import AccountInfoGrid from 'src/components/account/AccountInfoGrid';
import AccountEditButtonGrp from 'src/components/account/AccountEditButtonGrp';
interface modalParam {
  title: string;
  body: string;
  funct: () => void;
}

const ViewBusinessAccount = () => {
  let params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [editUser, setEditUser] = useState<User>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [modalParam, setModalParam] = useState<modalParam>({
    title: '',
    body: '',
    funct: () => {}
  });

  const handleRejectButtonClick = () => {
    setModalOpen(true);
    setModalParam({
      title: 'Reject Account Request',
      body: 'Are you sure you want to reject this account request?',
      funct: rejectAccount
    });
  };

  const handleApproveButtonClick = () => {
    setModalOpen(true);
    setModalParam({
      title: 'Approve Account Request',
      body: 'Are you sure you want to approve this account request?',
      funct: approveAccount
    });
  };

  const rejectAccount = () => {
    id &&
      asyncFetchCallback(rejectUserReqSvc(id), () => {
        setAlert({
          severity: 'warning',
          message: 'Account request rejected.'
        });
        setModalOpen(false);
        setUser((oldUser) => {
          return {
            ...oldUser!,
            status: UserStatus.DISABLED
          };
        });
      });
    setModalOpen(false);
  };

  const approveAccount = () => {
    id &&
      asyncFetchCallback(approveUserReqSvc(id), () => {
        setAlert({
          severity: 'success',
          message: 'Account request approved.'
        });
        setModalOpen(false);
        setUser((oldUser) => {
          return {
            ...oldUser!,
            status: UserStatus.ACTIVE
          };
        });
      });
    setModalOpen(false);
  };

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
          setTimeout(() => navigate('/accounts'), 3500);
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
        navigate(`/accounts/viewAccount?id=${id}`);
        setUser((oldUser) => {
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
        navigate(`/accounts/viewAccount?id=${id}`);
        setUser((oldUser) => {
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

  useEffect(() => {
    id &&
      asyncFetchCallback(getUserDetailsSvc(id), (user: User) => {
        if (user) {
          setUser(user);
          setEditUser(user);
          setLoading(false);
        } else {
          setAlert({
            severity: 'error',
            message:
              'User does not exist. You will be redirected back to the B2B Accounts page.'
          });
          setLoading(false);
          setTimeout(() => navigate('/accounts/business'), 3500);
        }
      });
  }, [id, navigate]);

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

      <Tooltip title='Return to Requests' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate('/accounts/business')}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>

      <div className='center-div'>
        <Box className='center-box'>
          <div className='header-content'>
            <h1>View Account Request</h1>
            {user?.status === UserStatus.PENDING && (
              <ApproveRejectButtonGrp
                loading={loading}
                handleRejectButtonClick={handleRejectButtonClick}
                handleApproveButtonClick={handleApproveButtonClick}
              />
            )}
            {user?.status !== UserStatus.PENDING &&
              user?.status !== UserStatus.REJECTED && (
                <AccountEditButtonGrp
                  loading={loading}
                  edit={edit}
                  user={user!}
                  editUser={editUser!}
                  handleDeleteButtonClick={handleDeleteButtonClick}
                  handleDisableButtonClick={handleDisableButtonClick}
                  handleEnableButtonClick={handleEnableButtonClick}
                  setEditUser={() => setEditUser(user!)}
                  setEdit={setEdit}
                  handleSaveButtonClick={handleSaveButtonClick}
                />
              )}
          </div>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          <Paper elevation={2}>
            <div className='content-body'>
              <div className='right-content'>
                <AccountInfoGrid user={user!} />
              </div>
            </div>
            <div className='view-button-group'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  navigate(-1);
                }}
              >
                Back
              </Button>
            </div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default ViewBusinessAccount;
