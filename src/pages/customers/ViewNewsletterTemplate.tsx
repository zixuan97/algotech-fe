import React from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import '../../styles/pages/customer/customer.scss';
import { ChevronLeft } from '@mui/icons-material';
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import { NewsletterTemplate } from 'src/models/types';
import { getNewsletterTemplateById } from 'src/services/customerService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import PreviewTemplateModal from 'src/components/customers/PreviewTemplateModal';

const ViewNewsletterTemplate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [originalNewsletterTemplate, setOriginalNewsletterTemplate] =
    React.useState<NewsletterTemplate>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openPreviewModal, setOpenPreviewModal] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      asyncFetchCallback(
        getNewsletterTemplateById(id),
        (res) => {
          setOriginalNewsletterTemplate(res);
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [id]);

  return (
    <div className='view-newsletter-template'>
      <div className='view-newsletter-template-heading'>
        <Tooltip title='Return to Previous Page' enterDelay={300}>
          <IconButton size='large' onClick={() => navigate(-1)}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <h1>View Newsletter Template ID: #{id}</h1>
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
      <Paper elevation={2} className='view-newsletter-card'>
        <Grid container spacing={2} className='view-newsletter-grid'>
          <Grid item xs={12} className='view-newsletter-template-grid-item'>
            <h3 className='view-newsletter-template-label-text'>
              Newsletter Name
            </h3>
            <Typography className='view-newsletter-template-value-text'>
              {originalNewsletterTemplate?.name}
            </Typography>
          </Grid>
          <Grid item xs={12} className='view-newsletter-template-grid-item'>
            <h3 className='view-newsletter-template-label-text'>
              Email Subject
            </h3>
            <Typography className='view-newsletter-template-value-text'>
              {originalNewsletterTemplate?.emailSubject}
            </Typography>
          </Grid>
          <Grid item xs={12} className='view-newsletter-template-grid-item'>
            <h3 className='view-newsletter-template-label-text'>
              Email Body Title
            </h3>
            <Typography className='view-newsletter-template-value-text'>
              {originalNewsletterTemplate?.emailBodyTitle}
            </Typography>
          </Grid>
          <Grid item xs={12} className='view-newsletter-template-grid-item'>
            <h3 className='view-newsletter-template-label-text'>Email Body</h3>
            <Typography className='view-newsletter-template-value-text'>
              {originalNewsletterTemplate?.emailBody}
            </Typography>
          </Grid>
          <Grid item xs={12} className='view-newsletter-template-grid-item'>
            <h3 className='view-newsletter-template-label-text'>
              Discount Code
            </h3>
            <Typography className='view-newsletter-template-value-text'>
              {originalNewsletterTemplate?.discountCode}
            </Typography>
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
    </div>
  );
};

export default ViewNewsletterTemplate;
