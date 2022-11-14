import { CircularProgress, Button } from '@mui/material';
import { useState } from 'react';
import { DiscountCode } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
// import validator from 'validator';
import ConfirmationModal from '../common/ConfirmationModal';
import { AlertType } from '../common/TimeoutAlert';
import { useNavigate } from 'react-router-dom';
import {
  deleteDiscountCodeSvc,
  editDiscountCodeSvc
} from 'src/services/discountCodeService';

interface props {
  id: string;
  edit: boolean;
  loading: boolean;
  discountCode: DiscountCode;
  editDiscountCode: DiscountCode;
  setEditDiscountCode: (dc: DiscountCode) => void;
  setDiscountCode: (dc: DiscountCode) => void;
  setEdit: (param: boolean) => void;
  setLoading: (loading: boolean) => void;
  setAlert: (alert: AlertType | null) => void;
  deletePath: string;
  viewPath: string;
}

interface modalParam {
  title: string;
  body: string;
  funct: () => void;
}

const DiscountEditButtonGrp = ({
  id,
  loading,
  edit,
  discountCode,
  editDiscountCode,
  setEditDiscountCode,
  setDiscountCode,
  setEdit,
  setLoading,
  setAlert,
  deletePath,
  viewPath
}: props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalParam, setModalParam] = useState<modalParam>({
    title: '',
    body: '',
    funct: () => {}
  });
  const navigate = useNavigate();

  const handleDeleteButtonClick = () => {
    setModalOpen(true);
    setModalParam({
      title: 'Delete Discount Code',
      body: 'Are you sure you want to delete this discount code?',
      funct: deleteDiscountCode
    });
  };

  const deleteDiscountCode = () => {
    setModalOpen(false);
    id &&
      asyncFetchCallback(
        deleteDiscountCodeSvc(id),
        () => {
          setAlert({
            severity: 'success',
            message:
              'Discount code deleted. You will be redirected back to the previous page.'
          });
          setModalOpen(false);
          setTimeout(() => navigate(`${deletePath}`), 3500);
        },
        () => {
          setModalOpen(false);
          setAlert({
            severity: 'error',
            message:
              'Cannot delete discount code at this point. Try again later.'
          });
        }
      );
  };

  const handleSaveButtonClick = (e: any) => {
    e.preventDefault();
    setLoading(true);
    asyncFetchCallback(
      editDiscountCodeSvc(editDiscountCode!),
      () => {
        setAlert({
          severity: 'success',
          message: 'Changes to discount code saved.'
        });
        setLoading(false);
        setDiscountCode(editDiscountCode);
      },
      () => {
        setAlert({
          severity: 'error',
          message: 'Error saving changes for discount code! Try again later.'
        });
        setLoading(false);
      }
    );
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
        {edit && (
          <Button
            variant='contained'
            className='create-btn'
            color='primary'
            onClick={() => {
              setEdit(false);
              setEditDiscountCode(discountCode);
            }}
          >
            DISCARD CHANGES
          </Button>
        )}
        <Button
          variant='contained'
          className='create-btn'
          color='primary'
          disabled={
            edit &&
            (!editDiscountCode.amount || !editDiscountCode.minOrderAmount)
          }
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (!edit) {
              setEdit(true);
            } else {
              handleSaveButtonClick(e);
              setEdit(false);
            }
          }}
        >
          {edit ? 'SAVE CHANGES' : 'EDIT'}
        </Button>

        {!edit && (
          <Button
            type='submit'
            variant='contained'
            className='create-btn'
            color='primary'
            onClick={handleDeleteButtonClick}
          >
            DELETE
          </Button>
        )}
      </div>
    </>
  );
};

export default DiscountEditButtonGrp;
