import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import React from 'react';

type ConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
  focusPassthrough?: boolean;
};

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  body,
  focusPassthrough = false
}: ConfirmationModalProps) => {
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} autoFocus={!focusPassthrough}>
            No
          </Button>
          <Button onClick={onConfirm} autoFocus={focusPassthrough}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationModal;
