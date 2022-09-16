import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Button
} from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft } from '@mui/icons-material';
import asyncFetchCallback from '../../../src/services/util/asyncFetchCallback';
import { User, UserRole } from 'src/models/types';
import { roles } from 'src/components/account/accountTypes';
import { createUserSvc } from 'src/services/accountService';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import validator from 'validator';

const CreateNewUser = () => {
  const placeholderUser: User = {
    id: 0,
    email: '',
    role: '',
    status: '',
    first_name: '',
    last_name: '',
    password: '',
    isVerified: false
  };

  const [alert, setAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<User>(placeholderUser);
  const [showFNError, setShowFNError] = useState<boolean>(false);
  const [showLNError, setShowLNError] = useState<boolean>(false);
  const [showRoleError, setShowRoleError] = useState<boolean>(false);

  const navigate = useNavigate();
  const handleCreateButtonClick = (e: any) => {
    if (
      newUser.email &&
      newUser.first_name &&
      newUser.last_name &&
      newUser.role
    ) {
      setLoading(true);
      e.preventDefault();
      asyncFetchCallback(
        createUserSvc(newUser),
        () => {
          setAlert({
            severity: 'success',
            message: 'Account created. You will be redirected to the Accounts page now.'
          });
          setNewUser(placeholderUser);
          setLoading(false);
          setShowFNError(false);
          setShowLNError(false);
          setShowRoleError(false);
          setTimeout(() => navigate('/accounts'), 3500);
        },
        () => {
          setAlert({
            severity: 'error',
            message: 'Error creating account! Try again later.'
          });
          setLoading(false);
        }
      );
    }
  };

  const userFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setNewUser((user: User) => {
      return {
        ...user,
        [key]: event.target.value
      };
    });
  };

  return (
    <>
      <Tooltip title='Return to Accounts' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate('/accounts')}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>

      <div className='center-div'>
        <Box className='center-box'>
          <h1>Create New User Account</h1>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          <Paper elevation={2}>
            <form>
              <div className='content-body'>
                <div className='right-content'>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id='outlined-quantity'
                        label='First Name'
                        name='firstName'
                        placeholder='eg.: John'
                        value={newUser?.first_name}
                        error={!newUser?.first_name && showFNError}
                        helperText={
                          !newUser?.first_name && showFNError
                            ? 'First Name is empty!'
                            : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          userFieldOnChange(e, 'first_name')
                          setShowFNError(true);
                        }
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id='outlined-quantity'
                        label='Last Name'
                        name='lastName'
                        placeholder='eg.: Tan'
                        value={newUser?.last_name}
                        error={validator.isEmpty(newUser?.last_name) && showLNError}
                        helperText={
                          !newUser?.last_name && showLNError
                            ? 'Last Name is empty!'
                            : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          userFieldOnChange(e, 'last_name')
                          setShowLNError(true);
                        }

                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id='outlined-quantity'
                        label='Email'
                        name='email'
                        placeholder='eg.: johntan@gmail.com'
                        value={newUser?.email}
                        error={!validator.isEmail(newUser?.email) && !!newUser?.email}
                        helperText={
                          !validator.isEmail(newUser?.email) && !!newUser?.email
                            ? 'Enter a valid email: example@email.com'
                            : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          userFieldOnChange(e, 'email')
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id='outlined-field'
                        select
                        label='Role'
                        value={newUser?.role}
                        error={validator.isEmpty(newUser?.role) && !newUser?.role && showRoleError}
                        helperText={
                          validator.isEmpty(newUser?.role) && !newUser?.role && showRoleError
                            ? 'Please select a role'
                            : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          userFieldOnChange(e, 'role')
                          setShowRoleError(true);
                        }
                        }
                      >
                        {roles.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div className="view-button-group">
                {loading && <CircularProgress color='secondary' />}
                <Button
                  type='submit'
                  variant='contained'
                  className='create-btn'
                  color='primary'
                  onClick={() => {
                    navigate(`/accounts`);
                  }}
                >
                  CANCEL
                </Button>
                <Button
                  disabled={!validator.isEmail(newUser.email) || validator.isEmpty(newUser?.last_name) || validator.isEmpty(newUser?.first_name)}
                  type='submit'
                  variant='contained'
                  className='create-btn'
                  color='primary'
                  onClick={handleCreateButtonClick}
                >
                  CREATE ACCOUNT
                </Button>

                {/* <BottomButton
                  location='accounts'
                  firstButtonText='CANCEL'
                  secondButtonText='CREATE ACCOUNT'
                  secondButtonFn={handleCreateButtonClick}
                /> */}
              </div>
            </form>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default CreateNewUser;
