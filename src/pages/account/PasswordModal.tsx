import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';
import { AlertType } from 'src/components/common/Alert';
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
            message: 'A reset password email has been sent to your provided email.'
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

  return (
    <div>
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
          {alert && (
            <Alert severity={alert.severity} onClose={() => setAlert(null)} style={{ margin: '1%' }}>
              {alert.message}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          {loading && <CircularProgress color='secondary' />}
          <Button onClick={onClose} autoFocus={!focusPassthrough}>
            Close
          </Button>
          <Button onClick={() => handleForgetPassword()} autoFocus={focusPassthrough}>
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PasswordModal;
