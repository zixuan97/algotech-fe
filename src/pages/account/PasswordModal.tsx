import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  FormControl
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import { forgetPasswordSvc } from 'src/services/accountService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';

type PasswordModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
  focusPassthrough?: boolean;
};

const PasswordModal = ({
  open,
  onClose,
  title,
  body,
  focusPassthrough = false
}: PasswordModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [recipientEmail, setRecipientEmail] = useState<string>('');

  const handleForgetPassword = async () => {
    setLoading(true);
    if (recipientEmail) {
      await asyncFetchCallback(
        forgetPasswordSvc(recipientEmail),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message:
              'A reset password email has been sent to your provided email.'
          });
        },
        () => {
          setLoading(false);
          setAlert({
            severity: 'error',
            message: 'Error resetting password. Try again later.'
          });
        }
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientEmail(e.target.value);
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleForgetPassword();
    }
  };

  return (
    <div>
      <form onSubmit={(handleForgetPassword)}>
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {body}
            </DialogContentText>
            <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Email Address'
              type='email'
              fullWidth
              variant='standard'
              onChange={handleChange}
              onKeyDown={keyDownHandler}
            />
          </DialogContent>
          <DialogActions>
            {loading && <CircularProgress color='secondary' />}
            <Button onClick={onClose} autoFocus={!focusPassthrough}>
              Close
            </Button>
            <Button
              type="submit"
              onClick={() => handleForgetPassword()}
              autoFocus={focusPassthrough}
            >
              Send Email
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default PasswordModal;
