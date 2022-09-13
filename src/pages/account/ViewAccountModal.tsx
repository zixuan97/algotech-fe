import React, { useState } from 'react';
import ConfirmationModal from 'src/components/common/ConfirmationModal';

type AccountModalWrapperProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    textTitle: string;
    textBody: string;
    intent: string;
};

const ViewAccountModal = ({
    isOpen,
    textTitle,
    textBody,
    intent
}: AccountModalWrapperProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const handleDeleteAccount = () => {
        // id &&
        //   asyncFetchCallback(
        //     deleteUserSvc(id),
        //     () => {
        //       handleCloseDialog();
        //     },
        //     () => {
        //       //handle error here
        //     }
        //   );
        console.log("button hit");
    };

    switch (intent) {
        case "delete": {
            return (
                <ConfirmationModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onConfirm={() => handleDeleteAccount}
                    title={textTitle}
                    body={textBody}
                />
            )
        }
        case "disable": {
            //statements; 
            break;
        }
        case "edit": {
            //statements; 
            break;
        }
        default: {
            //statements; 
            break;
        }
    }



    // return (
    //   <div>
    //     <Dialog
    //       open={open}
    //       onClose={onClose}
    //       aria-labelledby='alert-dialog-title'
    //       aria-describedby='alert-dialog-description'
    //     >
    //       <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
    //       <DialogContent>
    //         <DialogContentText id='alert-dialog-description'>
    //           {body}
    //         </DialogContentText>
    //       </DialogContent>
    //       <DialogActions>
    //         <Button onClick={onClose} autoFocus={!focusPassthrough}>
    //           No
    //         </Button>
    //         <Button onClick={onConfirm} autoFocus={focusPassthrough}>
    //           Yes
    //         </Button>
    //       </DialogActions>
    //     </Dialog>
    //   </div>
    // );
};

export default ViewAccountModal;
