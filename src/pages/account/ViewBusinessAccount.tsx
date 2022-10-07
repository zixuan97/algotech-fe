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
  approveUserReqSvc
} from 'src/services/accountService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { User, UserStatus } from 'src/models/types';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import TimeoutAlert, { AlertType } from '../../components/common/TimeoutAlert';
import ApproveRejectButtonGrp from 'src/components/account/ApproveRejectButtonGrp';
interface modalParam {
  title: string;
  body: string;
  funct: () => void;
}

const ViewBusinessAccount = () => {
  let params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [modalParam, setModalParam] = useState<modalParam>({
    title: '',
    body: '',
    funct: () => {}
  });
  const id = params.get('id');

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

  useEffect(() => {
    id &&
      asyncFetchCallback(getUserDetailsSvc(id), (user: User) => {
        if (user) {
          setUser(user);
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
          </div>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          <Paper elevation={2}>
            <div className='content-body'>
              <div className='right-content'>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <div>
                      <h4>First Name</h4>
                      <Typography>{user?.firstName}</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <h4>Last Name</h4>
                      <Typography>{user?.lastName}</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <h4>Email</h4>
                      <Typography>{user?.email}</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <h4>Role</h4>
                      <Typography>
                        {user?.role} ({user?.status})
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
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
