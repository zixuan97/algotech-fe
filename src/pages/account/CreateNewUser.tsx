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
import { createUserSvc, getAllTiers } from 'src/services/accountService';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import validator from 'validator';

const roles = Object.keys(UserRole).filter((v) => isNaN(Number(v)) && (!['CORPORATE', 'CUSTOMER', 'DISTRIBUTOR', 'B2B'].includes(v)));

export type NewUserType = Partial<User>;

const CreateNewUser = () => {
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<NewUserType>({});
  const [showFNError, setShowFNError] = useState<boolean>(false);
  const [showLNError, setShowLNError] = useState<boolean>(false);
  const [showRoleError, setShowRoleError] = useState<boolean>(false);
  const [showTierError, setShowTierError] = useState<boolean>(false);

  const [tiers, setTiers] = useState<string[]>([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllTiers(),
      (res) => {
        setLoading(false);
        setTiers(res);
      },
      () => setLoading(false)
    );
  }, []);

  const handleCreateButtonClick = (e: any) => {
    if (
      newUser.email &&
      newUser.firstName &&
      newUser.lastName &&
      newUser.role &&
      newUser.tier
    ) {
      console.log('newUser', newUser);
      setLoading(true);
      e.preventDefault();
      asyncFetchCallback(
        createUserSvc(newUser),
        () => {
          setAlert({
            severity: 'success',
            message:
              'Account created. You will be redirected to the Accounts page now.'
          });
          setNewUser({});
          setLoading(false);
          setShowFNError(false);
          setShowLNError(false);
          setShowRoleError(false);
          setShowTierError(false);
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
    setNewUser((user: NewUserType) => {
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
                        value={newUser.firstName}
                        error={!newUser.firstName && showFNError}
                        helperText={
                          !newUser.firstName && showFNError
                            ? 'First Name is empty!'
                            : ''
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          userFieldOnChange(e, 'firstName');
                          setShowFNError(true);
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id='outlined-quantity'
                        label='Last Name'
                        name='lastName'
                        placeholder='eg.: Tan'
                        value={newUser.lastName}
                        error={!newUser.lastName && showLNError}
                        helperText={
                          !newUser.lastName && showLNError
                            ? 'Last Name is empty!'
                            : ''
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          userFieldOnChange(e, 'lastName');
                          setShowLNError(true);
                        }}
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
                        error={
                          newUser.email !== undefined &&
                          !validator.isEmail(newUser.email!) &&
                          !!newUser?.email
                        }
                        helperText={
                          newUser.email !== undefined &&
                          !validator.isEmail(newUser.email!) &&
                          !!newUser?.email
                            ? 'Enter a valid email: example@email.com'
                            : ''
                        }
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
                        error={
                          newUser.role !== undefined &&
                          validator.isEmpty(newUser.role!) &&
                          !newUser?.role &&
                          showRoleError
                        }
                        helperText={
                          newUser.role !== undefined &&
                          validator.isEmpty(newUser.role!) &&
                          !newUser?.role &&
                          showRoleError
                            ? 'Please select a role'
                            : ''
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          userFieldOnChange(e, 'role');
                          setShowRoleError(true);
                        }}
                      >
                        {roles.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id='outlined-field'
                        select
                        label='Leave Tier'
                        value={newUser?.tier}
                        error={
                          newUser.tier !== undefined &&
                          validator.isEmpty(newUser.tier!) &&
                          !newUser?.tier &&
                          showTierError
                        }
                        helperText={
                          newUser.tier !== undefined &&
                          validator.isEmpty(newUser.tier!) &&
                          !newUser?.tier &&
                          showTierError
                            ? 'Please select a leave tier'
                            : ''
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          userFieldOnChange(e, 'tier');
                          setShowTierError(true);
                        }}
                      >
                        {tiers.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div className='view-button-group'>
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
                  disabled={
                    !newUser?.email ||
                    !newUser?.lastName ||
                    !newUser?.firstName ||
                    !newUser?.role ||
                    !newUser?.tier
                  }
                  type='submit'
                  variant='contained'
                  className='create-btn'
                  color='primary'
                  onClick={handleCreateButtonClick}
                >
                  CREATE ACCOUNT
                </Button>
              </div>
            </form>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default CreateNewUser;
