import { CircularProgress, Button } from '@mui/material';
import { useState } from 'react';
import { User, UserStatus } from 'src/models/types';
import {
  approveUserReqSvc,
  rejectUserReqSvc
} from 'src/services/accountService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import ConfirmationModal from '../common/ConfirmationModal';
import { AlertType } from '../common/TimeoutAlert';

interface props {
  id: string;
  user: User;
  loading: boolean;
  setLoading: (bool: boolean) => void;
  setAlert: (alert: AlertType | null) => void;
  setUser: (user: any) => void;
  setApproveRej: (bool: boolean) => void;
}
interface modalParam {
  title: string;
  body: string;
  funct: () => void;
}

const AppRejButtonGrp = ({ id, user, loading, setAlert, setUser, setApproveRej, setLoading }: props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
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
    setLoading(true);
    id &&
      asyncFetchCallback(rejectUserReqSvc(id), () => {
        setAlert({
          severity: 'warning',
          message: 'Account request rejected.'
        });
        setModalOpen(false);
        setUser((oldUser: User) => {
          return {
            ...oldUser!,
            status: UserStatus.REJECTED
          };
        });
        setLoading(false);
      });
    setModalOpen(false);
  };

  const approveAccount = () => {
    setLoading(true);
    id &&
      asyncFetchCallback(approveUserReqSvc(id), () => {
        setAlert({
          severity: 'success',
          message: 'Account request approved.'
        });
        setApproveRej(false);
        setModalOpen(false);
        setUser((oldUser: User) => {
          return {
            ...oldUser!,
            status: UserStatus.ACTIVE
          };
        });
        setLoading(false);
      });
    setModalOpen(false);
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
          <Button
            type='submit'
            variant='contained'
            className='create-btn'
            color='warning'
            onClick={handleRejectButtonClick}
            disabled={user.status===UserStatus.REJECTED}
          >
            Reject
          </Button>
        

        <Button
          type='submit'
          variant='contained'
          className='create-btn'
          color='primary'
          onClick={handleApproveButtonClick}
        >
          Approve
        </Button>
      </div>
    </>
  );
};

export default AppRejButtonGrp;
