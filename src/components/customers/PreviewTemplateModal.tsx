import React from 'react';
import { Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../logo brown white text.png';

type PreviewTemplateModalProps = {
  open: boolean;
  onClose: () => void;
  title: String | undefined;
  body: String | undefined;
  discountCode: String | undefined;
};

const PreviewTemplateModal = ({
  open,
  onClose,
  title,
  body,
  discountCode
}: PreviewTemplateModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} scroll='body'>
      <div className='modal-top-bar'>
        <div className='modal-top-bar-container'>
          <div>
            <img
              src={logo}
              alt='logo'
              className='modal-logo'
              width={116}
              height={100}
            />
          </div>
          <div className='modal-icon-container'>
            <IconButton style={{ color: 'white' }} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <div className='modal-body'>
        <h2 className='preview-template-title-text'>{title}</h2>
        <Typography className='preview-template-body-text'>{body}</Typography>
        <div className='preview-template-discount-container'>
          <h3 className='preview-template-discount-label'>Code: </h3>
          <h3 className='preview-template-discount-code'>{discountCode}</h3>
        </div>
        <div className='modal-bottom-bar' />
      </div>
    </Dialog>
  );
};

export default PreviewTemplateModal;
