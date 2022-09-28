import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ExpandMore, Visibility, VisibilityOff } from '@mui/icons-material';
import asyncFetchCallback from '../../../src/services/util/asyncFetchCallback';
import { User } from 'src/models/types';
import { editUserSvc, updatePasswordSvc } from 'src/services/accountService';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import validator from 'validator';
import authContext from 'src/context/auth/authContext';
import usePrevious from 'src/hooks/usePrevious';
import PasswordEndAdornment from 'src/components/account/PasswordEndAdornment';

const ViewMyAccount = () => {
  const navigate = useNavigate();

  const { user, loadUser } = React.useContext(authContext);

  const [editUser, setEditUser] = useState<User>();
  const [edit, setEdit] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrPwdError, setShowCurrPwdError] = useState<boolean>(false);
  const [showNewPwdError, setShowNewPwdError] = useState<boolean>(false);
  const [showCfmPwdError, setShowCfmPwdError] = useState<boolean>(false);
  const [expandPwPanel, setExpandPwPanel] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const prevUserVerification = usePrevious(user?.isVerified);

  React.useEffect(() => {
    if (user) {
      setEditUser(user);
      setExpandPwPanel(!user.isVerified);
    }
  }, [user]);

  React.useEffect(() => {
    if (prevUserVerification === false && user?.isVerified) {
      setAlert({
        severity: 'success',
        message: 'Password successfully changed! You are now a verified user'
      });
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [prevUserVerification, user?.isVerified, navigate]);

  const userFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditUser((paramUser) => {
      return {
        ...paramUser!,
        [key]: event.target.value
      };
    });
  };

  const handleSaveButtonClick = (e: any) => {
    e.preventDefault();
    setLoading(true);
    asyncFetchCallback(
      editUserSvc(editUser!),
      () => {
        setLoading(false);
        setAlert({
          severity: 'success',
          message: 'Account edited.'
        });
        loadUser();
      },
      () => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message: 'Error saving changes for account! Try again later.'
        });
      }
    );
  };

  const updatePassword = (e: any) => {
    e.preventDefault();
    setLoading(true);
    asyncFetchCallback(
      updatePasswordSvc(user?.email!, currentPassword, newPassword),
      () => {
        setLoading(false);
        setAlert({
          severity: 'success',
          message: 'Password Updated.'
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowNewPwdError(false);
        setShowCurrPwdError(false);
        setShowCfmPwdError(false);
        loadUser();
      },
      (err) => {
        if (err.message === 'Request failed with status code 400') {
          setAlert({
            severity: 'error',
            message: 'Your current password is wrong. Try again.'
          });
        } else {
          setAlert({
            severity: 'error',
            message:
              'The password cannot be updated at this time. Try Again Later.'
          });
        }
        setLoading(false);
      }
    );
  };

  return (
    <>
      <div className='center-div'>
        <Box className='center-box'>
          <div className='account-header-content'>
            <h1>Your Profile Page</h1>
            <div className='button-group'>
              {loading && <CircularProgress color='secondary' />}
              {edit && (
                <Button
                  variant='contained'
                  className='create-btn'
                  color='primary'
                  onClick={() => {
                    setEdit(false);
                    user && setEditUser(user);
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
            </div>
          </div>
          {!user?.isVerified && (
            <Alert severity='info'>
              Please change your password to be verified
            </Alert>
          )}
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          <Paper elevation={2}>
            <form>
              <div className='content-body'>
                <div className='right-content'>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      {edit ? (
                        <TextField
                          fullWidth
                          required
                          id='outlined-quantity'
                          label='First Name'
                          name='firstName'
                          error={!editUser?.firstName}
                          helperText={
                            !editUser?.firstName ? 'First Name is empty!' : ''
                          }
                          placeholder='eg.: John'
                          value={editUser?.firstName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            userFieldOnChange(e, 'firstName')
                          }
                        />
                      ) : (
                        <div>
                          <h4>First Name</h4>
                          <Typography>{user?.firstName}</Typography>
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
                          error={!editUser?.lastName}
                          helperText={
                            !editUser?.lastName ? 'Last Name is empty!' : ''
                          }
                          placeholder='eg.: Tan'
                          value={editUser?.lastName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            userFieldOnChange(e, 'lastName')
                          }
                        />
                      ) : (
                        <div>
                          <h4>Last Name</h4>
                          <Typography>{user?.lastName}</Typography>
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={edit ? 12 : 6}>
                      {edit ? (
                        <TextField
                          required
                          fullWidth
                          id='outlined-quantity'
                          error={!validator.isEmail(editUser?.email!)}
                          label='Email'
                          name='email'
                          placeholder='eg.: johntan@gmail.com'
                          value={editUser?.email}
                          helperText={
                            validator.isEmail(editUser?.email!)
                              ? ''
                              : 'Enter a valid email: example@email.com'
                          }
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            userFieldOnChange(e, 'email')
                          }
                        />
                      ) : (
                        <div>
                          <h4>Email</h4>
                          <Typography>{user?.email}</Typography>
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={edit ? 12 : 6}>
                      {!edit && (
                        <div>
                          <h4>Role</h4>
                          <Typography>{user?.role}</Typography>
                        </div>
                      )}
                    </Grid>
                    {!edit && (
                      <Grid item xs={12}>
                        <Accordion
                          expanded={expandPwPanel}
                          onChange={() =>
                            user?.isVerified &&
                            setExpandPwPanel((prev) => !prev)
                          }
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls='panel1a-content'
                            id='panel1a-header'
                          >
                            <h4>Change Password</h4>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography>
                                  Enter your password details below to change
                                  your password.
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  required
                                  fullWidth
                                  type={showPassword ? 'text' : 'password'}
                                  error={
                                    (newPassword === currentPassword ||
                                      validator.isEmpty(currentPassword)) &&
                                    showNewPwdError
                                  }
                                  helperText={
                                    newPassword === currentPassword &&
                                    showCurrPwdError
                                      ? 'Current Password same as new password!'
                                      : validator.isEmpty(currentPassword) &&
                                        showCurrPwdError
                                      ? 'Current Password field is empty'
                                      : ''
                                  }
                                  id='outlined-currPwd'
                                  label='Current Password'
                                  name='currPwd'
                                  value={currentPassword}
                                  variant="outlined"
                                  onChange={(e: any) => {
                                    setCurrentPassword(e.target.value);
                                    setShowCurrPwdError(true);
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <PasswordEndAdornment
                                      showPassword={showPassword}
                                      setShowPassword={() =>
                                        setShowPassword((prev) => !prev)}
                                      />
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12}>
                              <TextField
                                  required
                                  fullWidth
                                  type={showPassword ? 'text' : 'password'}
                                  error={
                                    (confirmPassword !== newPassword ||
                                      newPassword === currentPassword ||
                                      !validator.isLength(newPassword, {
                                        min: 8,
                                        max: undefined
                                      })) &&
                                    showNewPwdError
                                  }
                                  helperText={
                                    newPassword !== confirmPassword &&
                                    showNewPwdError
                                      ? "New passwords don't match!"
                                      : !validator.isLength(newPassword, {
                                          min: 8,
                                          max: undefined
                                        }) && showNewPwdError
                                      ? 'Password length needs 8 characters'
                                      : ''
                                  }
                                  id='outlined-newPwd'
                                  label='New Password'
                                  name='newPwd'
                                  value={newPassword}
                                  variant="outlined"
                                  onChange={(e: any) => {
                                    setNewPassword(e.target.value);
                                    setShowNewPwdError(true);
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <PasswordEndAdornment
                                      showPassword={showPassword}
                                      setShowPassword={() =>
                                        setShowPassword((prev) => !prev)}
                                      />
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12}>
                              <TextField
                                  required
                                  fullWidth
                                  type={showPassword ? 'text' : 'password'}
                                  error={
                                    (confirmPassword !== newPassword ||
                                      confirmPassword === currentPassword ||
                                      !validator.isLength(confirmPassword, {
                                        min: 8,
                                        max: undefined
                                      })) &&
                                    showCfmPwdError
                                  }
                                  helperText={
                                    !validator.isLength(newPassword, {
                                      min: 8,
                                      max: undefined
                                    }) && showCfmPwdError
                                      ? 'Password length needs 8 characters'
                                      : ''
                                  }
                                  id='outlined-cfm-new-pwd'
                                  label='Confirm New Password'
                                  name='cfmNewPwd'
                                  value={confirmPassword}
                                  variant="outlined"
                                  onChange={(e: any) => {
                                    setConfirmPassword(e.target.value);
                                    setShowCfmPwdError(true);
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <PasswordEndAdornment
                                      showPassword={showPassword}
                                      setShowPassword={() =>
                                        setShowPassword((prev) => !prev)}
                                      />
                                    ),
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Button
                              style={{
                                margin: '1%',
                                display: 'flex',
                                justifyContent: 'flex-end'
                              }}
                              variant='contained'
                              className='create-btn'
                              color='primary'
                              onClick={updatePassword}
                              disabled={
                                !currentPassword ||
                                !newPassword ||
                                !confirmPassword ||
                                newPassword !== confirmPassword ||
                                currentPassword === newPassword ||
                                !validator.isLength(confirmPassword, {
                                  min: 8,
                                  max: undefined
                                })
                              }
                            >
                              Update Password
                            </Button>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    )}
                  </Grid>
                </div>
              </div>
            </form>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default ViewMyAccount;
