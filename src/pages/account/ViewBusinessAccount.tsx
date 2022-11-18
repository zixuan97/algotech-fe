import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Button, IconButton, Tooltip } from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft } from '@mui/icons-material';
import { getUserDetailsSvc } from 'src/services/accountService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { User, UserStatus } from 'src/models/types';
import TimeoutAlert, { AlertType } from '../../components/common/TimeoutAlert';
import ApproveRejectButtonGrp from 'src/components/account/ApproveRejectButtonGrp';
import AccountInfoGrid from 'src/components/account/AccountInfoGrid';
import AccountEditButtonGrp from 'src/components/account/AccountEditButtonGrp';
import AccountEditGrid from 'src/components/account/AccountEditGrid';

const ViewBusinessAccount = () => {
  let params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [editUser, setEditUser] = useState<User>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [approveRej, setApproveRej] = useState<boolean>(false);

  useEffect(() => {
    id &&
      asyncFetchCallback(getUserDetailsSvc(id), (user: User) => {
        if (user) {
          setUser(user);
          setEditUser(user);
          setLoading(false);
          if (
            user.status === UserStatus.PENDING ||
            user.status === UserStatus.REJECTED
          ) {
            setApproveRej(true);
          }
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
      <Tooltip title='Return to Requests' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate('/accounts/business')}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>

      <div className='center-div'>
        <Box className='center-box'>
          <div className='header-content'>
            <h1>View B2B Account</h1>
            {user && approveRej && (
              <ApproveRejectButtonGrp
                id={id!}
                user={user}
                setApproveRej={setApproveRej}
                setAlert={setAlert}
                setUser={setUser}
                setLoading={setLoading}
                loading={loading}
              />
            )}
            {user?.status !== UserStatus.PENDING &&
              user?.status !== UserStatus.REJECTED && (
                <AccountEditButtonGrp
                  id={id!}
                  loading={loading}
                  edit={edit}
                  user={user!}
                  editUser={editUser!}
                  setEditUser={() => setEditUser(user!)}
                  setEdit={setEdit}
                  setLoading={setLoading}
                  setAlert={setAlert}
                  setUser={setUser}
                  viewPath='/accounts/viewBusinessAccount'
                  deletePath='/accounts/business'
                />
              )}
          </div>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          <Paper elevation={2}>
            <div className='content-body'>
              <div className='right-content'>
                {edit ? (
                  <AccountEditGrid
                    editUser={editUser!}
                    setEditUser={setEditUser}
                  />
                ) : (
                  <AccountInfoGrid user={user!} />
                )}
              </div>
            </div>
            {/* <div className='view-button-group'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  navigate(-1);
                }}
              >
                Back
              </Button>
            </div> */}
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default ViewBusinessAccount;
