import React from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import '../../styles/pages/customer/customer.scss';
import { ChevronLeft } from '@mui/icons-material';
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { NewsletterTemplate, ScheduledNewsletter } from 'src/models/types';
import {
  deleteNewsletterTemplate,
  editNewsletterTemplate,
  getNewsletterTemplateById,
  getSendHistory
} from 'src/services/customerService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import PreviewTemplateModal from 'src/components/customers/PreviewTemplateModal';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment';
import ScheduledNewsletterCellAction from 'src/components/customers/ScheduledNewsletterCellAction';

const columns: GridColDef[] = [
  {
    field: 'sentDate',
    headerName: 'Sent Date',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      let date = params.value;
      let valueFormatted = moment(date).format('DD/MM/YYYY HH:mm');
      return valueFormatted;
    }
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: ScheduledNewsletterCellAction
  }
];

const ViewNewsletterTemplate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [originalNewsletterTemplate, setOriginalNewsletterTemplate] =
    React.useState<NewsletterTemplate>();
  const [updatedNewsletterTemplate, setUpdatedNewsletterTemplate] =
    React.useState<NewsletterTemplate>();
  const [sendHistory, setSendHistory] = React.useState<ScheduledNewsletter[]>(
    []
  );
  const [edit, setEdit] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [openPreviewModal, setOpenPreviewModal] =
    React.useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(
        getNewsletterTemplateById(id),
        (res) => {
          setOriginalNewsletterTemplate(res);
          setUpdatedNewsletterTemplate(res);
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [id]);

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      let reqBody = {
        newsletterId: Number(id)
      };

      asyncFetchCallback(
        getSendHistory(reqBody),
        (res) => {
          setSendHistory(res);
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [id]);

  const handleEditNewsletterTemplate = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await setUpdatedNewsletterTemplate((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleCancelUpdate = async () => {
    setEdit(false);
    setUpdatedNewsletterTemplate(originalNewsletterTemplate);
  };

  const handleNewsletterTemplateUpdate = async () => {
    if (updatedNewsletterTemplate?.name === '') {
      setAlert({
        severity: 'warning',
        message: 'Please input newsletter name!'
      });
      return;
    }

    if (updatedNewsletterTemplate?.emailSubject === '') {
      setAlert({
        severity: 'warning',
        message: 'Please input email subject!'
      });
      return;
    }

    if (updatedNewsletterTemplate?.emailBodyTitle === '') {
      setAlert({
        severity: 'warning',
        message: 'Please input email body title!'
      });
      return;
    }

    if (updatedNewsletterTemplate?.emailBody === '') {
      setAlert({
        severity: 'warning',
        message: 'Please input email body!'
      });
      return;
    }

    if (updatedNewsletterTemplate?.discountCode === '') {
      setAlert({
        severity: 'warning',
        message: 'Please input discount code!'
      });
      return;
    }

    setLoading(true);

    let reqBody = {
      id: originalNewsletterTemplate?.id,
      name: updatedNewsletterTemplate?.name,
      emailSubject: updatedNewsletterTemplate?.emailSubject,
      emailBodyTitle: updatedNewsletterTemplate?.emailBodyTitle,
      emailBody: updatedNewsletterTemplate?.emailBody,
      discountCode: updatedNewsletterTemplate?.discountCode
    };

    await asyncFetchCallback(
      editNewsletterTemplate(reqBody),
      (res) => {
        setOriginalNewsletterTemplate((originalNewsletterTemplate) => {
          if (originalNewsletterTemplate) {
            return {
              ...originalNewsletterTemplate,
              name: updatedNewsletterTemplate!.name,
              emailSubject: updatedNewsletterTemplate!.emailSubject,
              emailBodyTitle: updatedNewsletterTemplate!.emailBodyTitle,
              emailBody: updatedNewsletterTemplate!.emailBody,
              discountCode: updatedNewsletterTemplate!.discountCode
            };
          } else {
            return originalNewsletterTemplate;
          }
        });
        setAlert({
          severity: 'success',
          message: 'Newsletter Template updated successfully.'
        });
        setLoading(false);
        setEdit(false);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message: 'Newsletter Template was not updated successfully.'
        });
        setEdit(false);
      }
    );
  };

  const handleNewsletterTemplateDelete = async () => {
    setOpenDeleteModal(false);
    setLoading(true);

    if (originalNewsletterTemplate) {
      asyncFetchCallback(
        deleteNewsletterTemplate(originalNewsletterTemplate.id),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Newsletter Template successfully deleted. You will be redirected back to the All Newsletter Templates page now.'
          });
          setTimeout(() => navigate('/customer/allNewsletterTemplates'), 3500);
        },
        (err) => {
          setLoading(false);
          setAlert({
            severity: 'error',
            message: 'Newsletter Template was not deleted successfully.'
          });
        }
      );
    }
  };

  return (
    <div className='view-newsletter-template'>
      <div className='view-newsletter-template-top-section'>
        <div className='view-newsletter-template-heading'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>View Newsletter Template ID: #{id}</h1>
        </div>
        <div className='view-newsletter-template-edit-button-container'>
          <Button
            variant='contained'
            onClick={() => {
              if (!edit) {
                setEdit(true);
              } else {
                handleNewsletterTemplateUpdate();
              }
            }}
          >
            {edit ? 'Save Changes' : 'Edit'}
          </Button>
          {!edit && (
            <Button
              variant='contained'
              onClick={() => setOpenDeleteModal(true)}
            >
              Delete
            </Button>
          )}
          <ConfirmationModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={handleNewsletterTemplateDelete}
            title='Delete Newsletter Template'
            body='Are you sure you want to delete this template? This action cannot be reversed.'
          />
          {edit && (
            <Button
              variant='contained'
              size='medium'
              sx={{ width: 'fit-content' }}
              onClick={handleCancelUpdate}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      {alert && (
        <div className='newsletter-alert'>
          <TimeoutAlert
            alert={alert}
            timeout={6000}
            clearAlert={() => setAlert(null)}
          />
        </div>
      )}
      <Paper elevation={2} className='view-newsletter-card'>
        <Grid container spacing={2} className='view-newsletter-grid'>
          <Grid item xs={12} className='view-newsletter-template-grid-item'>
            <h3 className='view-newsletter-template-label-text'>
              Newsletter Name
            </h3>
            {edit ? (
              <TextField
                id='outlined-required'
                name='name'
                style={{ paddingLeft: '2rem' }}
                value={updatedNewsletterTemplate?.name}
                onChange={handleEditNewsletterTemplate}
                placeholder='Enter updated name here.'
                fullWidth
              />
            ) : (
              <Typography className='view-newsletter-template-value-text'>
                {originalNewsletterTemplate?.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} className='view-newsletter-template-grid-item'>
            <h3 className='view-newsletter-template-label-text'>
              Email Subject
            </h3>
            {edit ? (
              <TextField
                id='outlined-required'
                name='emailSubject'
                style={{ paddingLeft: '2rem' }}
                value={updatedNewsletterTemplate?.emailSubject}
                onChange={handleEditNewsletterTemplate}
                placeholder='Enter updated email subject here.'
                fullWidth
                multiline
              />
            ) : (
              <Typography className='view-newsletter-template-value-text'>
                {originalNewsletterTemplate?.emailSubject}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} className='view-newsletter-template-grid-item'>
            <h3 className='view-newsletter-template-label-text'>
              Email Body Header
            </h3>
            {edit ? (
              <TextField
                id='outlined-required'
                name='emailBodyTitle'
                style={{ paddingLeft: '2rem' }}
                value={updatedNewsletterTemplate?.emailBodyTitle}
                onChange={handleEditNewsletterTemplate}
                placeholder='Enter updated email body title here.'
                fullWidth
                multiline
              />
            ) : (
              <Typography className='view-newsletter-template-value-text'>
                {originalNewsletterTemplate?.emailBodyTitle}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} className='view-newsletter-template-grid-item'>
            <h3 className='view-newsletter-template-label-text'>Email Body</h3>
            {edit ? (
              <TextField
                id='outlined-required'
                name='emailBody'
                style={{ paddingLeft: '2rem' }}
                value={updatedNewsletterTemplate?.emailBody}
                onChange={handleEditNewsletterTemplate}
                placeholder='Enter updated email body here.'
                fullWidth
                multiline
              />
            ) : (
              <Typography className='view-newsletter-template-value-text'>
                {originalNewsletterTemplate?.emailBody}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} className='view-newsletter-template-grid-item'>
            <h3 className='view-newsletter-template-label-text'>
              Discount Code
            </h3>
            {edit ? (
              <TextField
                id='outlined-required'
                name='discountCode'
                style={{ paddingLeft: '2rem' }}
                value={updatedNewsletterTemplate?.discountCode}
                onChange={handleEditNewsletterTemplate}
                placeholder='Enter updated discount code here.'
                fullWidth
                multiline
              />
            ) : (
              <Typography className='view-newsletter-template-value-text'>
                {originalNewsletterTemplate?.discountCode}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
      <div className='view-newsletter-button-container'>
        <Button
          variant='contained'
          size='medium'
          sx={{ height: 'fit-content' }}
          onClick={() => setOpenPreviewModal(true)}
        >
          Preview
        </Button>
        <PreviewTemplateModal
          open={openPreviewModal}
          onClose={() => setOpenPreviewModal(false)}
          title={originalNewsletterTemplate?.emailBodyTitle}
          body={originalNewsletterTemplate?.emailBody}
          discountCode={originalNewsletterTemplate?.discountCode}
        />
      </div>
      <Divider />
      <h2 className='send-history-heading'>Send History</h2>
      <div className='send-history-data-grid'>
        <DataGrid
          columns={columns}
          rows={sendHistory}
          autoHeight
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </div>
  );
};

export default ViewNewsletterTemplate;
