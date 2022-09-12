import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface props {
    openDialog: boolean,
    message: string,
    title: string,
    closeDialogFn: Function
}

const CustomDialog: React.FC<props> = ({ openDialog, title, message, closeDialogFn }) => {

    return (
        <div>
            <Dialog
                open={openDialog}
                onClose={() => closeDialogFn()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to {message}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialogFn()}>Yes</Button>
                    <Button onClick={closeDialogFn()} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CustomDialog;