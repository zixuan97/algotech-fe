import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from '@mui/icons-material';
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material';
import { NewsletterTemplate } from 'src/models/types';
import { createNewsletterTemplate } from 'src/services/customerService';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import PreviewTemplateModal from 'src/components/customers/PreviewTemplateModal';

export type NewNewsletterTemplate = Partial<NewsletterTemplate> & {};

const CreateNewsletterTemplate = () => {
  const navigate = useNavigate();

  const [newNewsletterTemplate, setNewNewsletterTemplate] =
    React.useState<NewNewsletterTemplate>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [openPreviewModal, setOpenPreviewModal] =
    React.useState<boolean>(false);

  const handleEditNewsletterTemplate = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await setNewNewsletterTemplate((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleNewsletterTemplateCreation = async () => {
    if (newNewsletterTemplate?.name === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please input newsletter name!'
      });
      return;
    }

    if (newNewsletterTemplate?.emailSubject === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please input email subject!'
      });
      return;
    }

    if (newNewsletterTemplate?.emailBodyTitle === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please input email body title!'
      });
      return;
    }

    if (newNewsletterTemplate?.emailBody === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please input email body!'
      });
      return;
    }

    if (newNewsletterTemplate?.discountCode === undefined) {
      setAlert({
        severity: 'warning',
        message: 'Please input discount code!'
      });
      return;
    }

    setLoading(true);

    let reqBody = {
      name: newNewsletterTemplate?.name,
      emailSubject: newNewsletterTemplate?.emailSubject,
      emailBodyTitle: newNewsletterTemplate?.emailBodyTitle,
      emailBody: newNewsletterTemplate?.emailBody,
      discountCode: newNewsletterTemplate?.discountCode
    };

    await asyncFetchCallback(
      createNewsletterTemplate(reqBody),
      (res) => {
        setLoading(false);
        setAlert({
          severity: 'success',
          message: 'Newsletter Template successfully created!'
        });
        setTimeout(() => navigate('/customer/allNewsletterTemplates'), 3000);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message:
            'Newsletter Template was not created successfully, please try again!'
        });
      }
    );
  };

  return (
    <div className='create-newsletter-template'>
      <div className='create-newsletter-template-top-section'>
        <div className='create-newsletter-template-heading'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>Create Newsletter Template</h1>
        </div>
        <div className='preview-newsletter-button-container'>
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
            title={newNewsletterTemplate?.emailBodyTitle}
            body={newNewsletterTemplate?.emailBody}
            discountCode={newNewsletterTemplate?.discountCode}
          />
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
      <Grid container spacing={2} className='create-newsletter-grid'>
        <Grid item xs={12} style={{ paddingLeft: '4rem' }}>
          <h3 className='create-newsletter-grid-label-text'>Newsletter Name</h3>
          <TextField
            id='outlined-required'
            label='Name'
            name='name'
            value={newNewsletterTemplate?.name}
            onChange={handleEditNewsletterTemplate}
            placeholder='Enter newsletter name here.'
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} style={{ paddingLeft: '4rem' }}>
          <h3 className='create-newsletter-grid-label-text'>Email Subject</h3>
          <TextField
            id='outlined-required'
            label='Email Subject'
            name='emailSubject'
            value={newNewsletterTemplate?.emailSubject}
            onChange={handleEditNewsletterTemplate}
            placeholder='Enter email subject here.'
            required
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12} style={{ paddingLeft: '4rem' }}>
          <h3 className='create-newsletter-grid-label-text'>
            Email Body Title
          </h3>
          <TextField
            id='outlined-required'
            label='Email Body Title'
            name='emailBodyTitle'
            value={newNewsletterTemplate?.emailBodyTitle}
            onChange={handleEditNewsletterTemplate}
            placeholder='Enter email body title here.'
            required
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12} style={{ paddingLeft: '4rem' }}>
          <h3 className='create-newsletter-grid-label-text'>Email Body</h3>
          <TextField
            id='outlined-required'
            label='Email Body'
            name='emailBody'
            value={newNewsletterTemplate?.emailBody}
            onChange={handleEditNewsletterTemplate}
            placeholder='Enter email body here.'
            required
            multiline
            fullWidth
            rows={5}
          />
        </Grid>
        <Grid item xs={12} style={{ paddingLeft: '4rem' }}>
          <h3 className='create-newsletter-grid-label-text'>Discount Code</h3>
          <TextField
            id='outlined-required'
            label='Discount Code'
            name='discountCode'
            value={newNewsletterTemplate?.discountCode}
            onChange={handleEditNewsletterTemplate}
            placeholder='Enter discount code here.'
            required
            fullWidth
          />
        </Grid>
      </Grid>
      <div className='create-newsletter-button-container'>
        <Button variant='contained' onClick={handleNewsletterTemplateCreation}>
          Create Template
        </Button>
      </div>
    </div>
  );
};

export default CreateNewsletterTemplate;
