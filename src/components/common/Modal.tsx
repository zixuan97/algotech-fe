import React from 'react';
import { Dialog } from '@mui/material';

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const Modal = ({ open, onClose }: ModalProps) => {
  return (
    <div>
      <Dialog open={open} onClose={onClose}></Dialog>
    </div>
  );
};

export default Modal;
