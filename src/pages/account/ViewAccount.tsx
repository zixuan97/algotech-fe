import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Button, IconButton, Tooltip } from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft } from '@mui/icons-material';
import {
  deleteUserSvc,
  disableUserSvc,
  enableUserSvc,
  getUserDetailsSvc
} from 'src/services/account/accountService';
import asyncFetchCallback from '../../../src/services/util/asyncFetchCallback';
import { User } from 'src/models/types';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import { toast } from 'react-toastify';
interface ModalProps {
  wrapperParam: wrapperParam,
  modalOpen: boolean,
  onClose: () => void
}
interface wrapperParam {
  title: string,
  body: string,
  funct: () => void,
}

const WrapperModal = ({ wrapperParam, modalOpen, onClose }: ModalProps) => {
  return (
    <ConfirmationModal
      title={wrapperParam.title}
      body={wrapperParam.body}
      onConfirm={wrapperParam.funct}
      open={modalOpen}
      onClose={onClose}
    />
  )
};

const ViewAccount = () => {
  let params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const [wrapParam, setWrapParam] = useState<wrapperParam>({
    title: '',
    body: '',
    funct: () => { }
  })
  const loaded = useRef(false);
  const id = params.get('id');

  const handleEditButtonClick = () => {
    console.log('Incomplete');
  };

  const handleDisableButtonClick = () => {
    setWrapParam({
      title: "Disable Account",
      body: "Are you sure you want to disable this account?",
      funct: handleDisableAccount
    });
  };

  const handleEnableButtonClick = () => {
    setWrapParam({
      title: "Enable Account",
      body: "Are you sure you want to enable this account?",
      funct: handleEnableAccount
    });
  };

  const handleDeleteButtonClick = () => {
    setWrapParam({
      title: "Delete Account",
      body: "Are you sure you want to delete this account?",
      funct: handleDeleteAccount
    });
  };

  const handleDeleteAccount = () => {
    id &&
      asyncFetchCallback(
        deleteUserSvc(id),
        () => {
          toast.success('Account deleted.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          setModalOpen(false);
          navigate('/accounts');
        }
      );
    setModalOpen(false);
  };

  const handleDisableAccount = () => {
    id &&
      asyncFetchCallback(
        disableUserSvc(id),
        () => {
          toast.success('Account disabled.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          setModalOpen(false);
          navigate('/accounts');
        }
      );
    setModalOpen(false);
  };

  const handleEnableAccount = () => {
    id &&
      asyncFetchCallback(
        enableUserSvc(id),
        () => {
          toast.success('Account enabled.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          setModalOpen(false);
          navigate('/accounts');
        }
      );
    setModalOpen(false);
  };

  useEffect(() => {
    if (loaded.current) {
      setModalOpen(!modalOpen);
    } else {
      loaded.current = true;
    }
  }, [wrapParam]);

  useEffect(() => {
    id &&
      asyncFetchCallback(
        getUserDetailsSvc(id),
        (user: User) => {
          setUser(user);
        },
        () => {
          //handle error here
        }
      );
  }, []);

  !user && <div>Loading ...</div>;

  return (
    <>
      <WrapperModal
        modalOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
        }}
        wrapperParam={wrapParam}
      />

      <Tooltip title='Return to Accounts' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate('/accounts')}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>

      <div className='center-div'>
        <Box className='center-box'>
          <div className='header-content'>
            <h1>View User ID: {params.get('id')} </h1>
            <div className='button-group'>
              <Button
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={() => handleEditButtonClick()}
              >
                EDIT
              </Button>
              <Button
                type='submit'
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={handleDeleteButtonClick}
              >
                DELETE
              </Button>
              <Button
                type='submit'
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={user?.status === "ACTIVE" ? handleDisableButtonClick: handleEnableButtonClick}
              >
                {user?.status === "ACTIVE" ? "DISABLE": "ENABLE"}
              </Button>
            </div>
          </div>

          <Paper elevation={2}>
            <div className='content-body'>
              <div className='right-content'>
                <Box className='display-box'>
                  <div>
                    <h6>User ID</h6>
                    <h4>{user?.id}</h4>
                  </div>

                  <div>
                    <h6>Role</h6>
                    <h4>{user?.role}</h4>
                  </div>
                </Box>

                <Box className='display-box'>
                  <div>
                    <h6>First Name</h6>
                    <h4>{user?.first_name}</h4>
                  </div>

                  <div>
                    <h6>Last Name</h6>
                    <h4>{user?.last_name}</h4>
                  </div>
                </Box>

                <Box className='display-box'>
                  <div>
                    <h6>Email</h6>
                    <h4>{user?.email}</h4>
                  </div>
                </Box>
              </div>
            </div>
            <div className='view-button-group'>
              <Button
                type='submit'
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={() => {
                  navigate('/accounts');
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

export default ViewAccount;
