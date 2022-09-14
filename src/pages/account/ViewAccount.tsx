import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Paper, Button, IconButton, Tooltip, Grid, CircularProgress } from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft } from '@mui/icons-material';
import {
  deleteUserSvc,
  disableUserSvc,
  enableUserSvc,
  getUserDetailsSvc
} from 'src/services/accountService';
import asyncFetchCallback from '../../../src/services/util/asyncFetchCallback';
import { User } from 'src/models/types';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import { toast } from 'react-toastify';
import { Typography } from '@mui/material';
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
  const [loading, setLoading] = React.useState<boolean>(true);
  const [wrapParam, setWrapParam] = useState<wrapperParam>({
    title: '',
    body: '',
    funct: () => { }
  })
  const loaded = useRef(false);
  const id = params.get('id');

  const handleDisableButtonClick = () => {
    setWrapParam({
      title: "Disable Account",
      body: "Are you sure you want to disable this account?",
      funct: disableAccount
    });
  };

  const handleEnableButtonClick = () => {
    setWrapParam({
      title: "Enable Account",
      body: "Are you sure you want to enable this account?",
      funct: enableAccount
    });
  };

  const handleDeleteButtonClick = () => {
    setWrapParam({
      title: "Delete Account",
      body: "Are you sure you want to delete this account?",
      funct: deleteAccount
    });
  };

  const deleteAccount = () => {
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

  const disableAccount = () => {
    id &&
      asyncFetchCallback(
        disableUserSvc(id),
        () => {
          toast.warning('Account disabled.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          setModalOpen(false);
          navigate(`/accounts/viewAccount?id=${id}`);
        }
      );
    setModalOpen(false);
  };

  const enableAccount = () => {
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
          navigate(`/accounts/viewAccount?id=${id}`);
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
          setLoading(false);
        },
        () => {
          //handle error here
        }
      );
  }, [user]);

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
            <h1>View User Account </h1>
            <div className='button-group'>
              {loading && <CircularProgress color='secondary' />}
              <Link
                to="/accounts/editAccount"
                state={user}
              >
                <Button
                  variant='contained'
                  className='create-btn'
                  color='primary'>
                  EDIT
                </Button>
              </Link>
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
                onClick={user?.status === "ACTIVE" ? handleDisableButtonClick : handleEnableButtonClick}
              >
                {user?.status === "ACTIVE" ? "DISABLE" : "ENABLE"}
              </Button>
            </div>
          </div>

          <Paper elevation={2}>
            <div className='content-body'>
              <div className='right-content'>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <div>
                      <h4>First Name</h4>
                      <Typography>
                        {user?.first_name}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <h4>Last Name</h4>
                      <Typography>
                        {user?.last_name}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <h4>Email</h4>
                      <Typography>
                        {user?.email}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <h4>Role</h4>
                      <Typography>
                        {user?.role}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
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
