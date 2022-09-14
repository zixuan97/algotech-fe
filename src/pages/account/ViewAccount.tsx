import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Paper, Button, IconButton, Tooltip, Grid, CircularProgress, Typography, Alert, TextField, MenuItem } from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft } from '@mui/icons-material';
import {
  deleteUserSvc,
  disableUserSvc,
  editUserSvc,
  enableUserSvc,
  getUserDetailsSvc
} from 'src/services/accountService';
import asyncFetchCallback from '../../../src/services/util/asyncFetchCallback';
import { User } from 'src/models/types';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import { AlertType } from 'src/components/common/Alert';
import { roles } from 'src/components/account/accountTypes';
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

const placeholderUser: User = {
  //note: id is temp holder, BE doesn't consume id on create
  id: 0,
  email: '',
  role: '',
  status: '',
  first_name: '',
  last_name: '',
  password: '',
  isVerified: true
};

const ViewAccount = () => {
  let params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(placeholderUser);
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
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
          setAlert({
            severity: 'success',
            message: 'Account deleted.'
          });
          setModalOpen(false);
          navigate('/accounts');
        }, () => {
          setAlert({
            severity: 'error',
            message: 'Cannot delete user at this point. Try again later.'
          });
        }
      );
    setModalOpen(false);
  };

  const disableAccount = () => {
    id &&
      asyncFetchCallback(
        disableUserSvc(id),
        () => {
          setAlert({
            severity: 'success',
            message: 'Account disabled.'
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
          setAlert({
            severity: 'success',
            message: 'Account enabled.'
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

  const userFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setUser((paramUser: User) => {
      return {
        ...paramUser,
        [key]: event.target.value
      };
    });
  };

  const handleSaveButtonClick = (e: any) => {
    e.preventDefault();
    setLoading(true);
    asyncFetchCallback(
      editUserSvc(user),
      () => {
        setAlert({
          severity: 'success',
          message: 'Account edited.'
        });
        setLoading(false);
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
              <Button
                variant='contained'
                className='create-btn'
                color='primary'
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!edit) {
                    setEdit(true);
                  } else {
                    handleSaveButtonClick(e);
                    setEdit(false);
                  }
                }}
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
                onClick={user?.status === "ACTIVE" ? handleDisableButtonClick : handleEnableButtonClick}
              >
                {user?.status === "ACTIVE" ? "DISABLE" : "ENABLE"}
              </Button>
            </div>
          </div>
          {alert && (
            <Alert severity={alert.severity} onClose={() => setAlert(null)} style={{ margin: '1%' }}>
              {alert.message}
            </Alert>
          )}
          <Paper elevation={2}>
            <div className='content-body'>
              <div className='right-content'>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    {edit ? (
                      <TextField
                        fullWidth
                        required
                        id='outlined-quantity'
                        label='First Name'
                        name='firstName'
                        placeholder='eg.: John'
                        value={user?.first_name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          userFieldOnChange(e, 'first_name')
                        }
                      />
                    ) : (
                      <div>
                        <h4>First Name</h4>
                        <Typography>
                          {user?.first_name}
                        </Typography>
                      </div>
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    {edit ? (
                      <TextField
                        fullWidth
                        required
                        id='outlined-quantity'
                        label='Last Name'
                        name='lastName'
                        placeholder='eg.: Tan'
                        value={user?.last_name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          userFieldOnChange(e, 'last_name')
                        }
                      />
                    ) : (
                      <div>
                        <h4>Last Name</h4>
                        <Typography>
                          {user?.last_name}
                        </Typography>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={edit ? 12 : 6}>
                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-quantity'
                        label='Email'
                        name='email'
                        placeholder='eg.: johntan@gmail.com'
                        value={user?.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          userFieldOnChange(e, 'email')
                        }
                      />
                    ) : (
                      <div>
                        <h4>Email</h4>
                        <Typography>
                          {user?.email}
                        </Typography>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={edit ? 12 : 6}>
                    {edit ? (
                      <TextField
                        required
                        fullWidth
                        id='outlined-field'
                        select
                        label='Role'
                        value={user?.role}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          userFieldOnChange(e, 'role')
                        }
                      >
                        {roles.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <div>
                        <h4>Role</h4>
                        <Typography>
                          {user?.role}
                        </Typography>
                      </div>
                    )}
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
