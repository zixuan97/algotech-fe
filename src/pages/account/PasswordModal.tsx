import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Backdrop
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [inputEmail, setInputEmail] = useState<string>('');
  const navigate = useNavigate();

  const handleForgetPassword = async () => {
    setLoading(true);
    await asyncFetchCallback(
      forgetPasswordSvc(inputEmail!),
      (res) => {
        setLoading(false);
        // TODO: print out success
        navigate({ pathname: '/login' });
      },
      () => setLoading(false)
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(e.target.value);
  };

  return (
    <div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
      />
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
          <Button onClick={onClose} autoFocus={!focusPassthrough}>
            Close
          </Button>
          <Button onClick={handleForgetPassword} autoFocus={focusPassthrough}>
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PasswordModal;
