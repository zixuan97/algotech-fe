import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from '@mui/icons-material';
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip
} from '@mui/material';
import {
  Customer,
  NewsletterTemplate,
  ScheduledNewsletter
} from 'src/models/types';
import moment, { Moment } from 'moment';
import { DateTimePicker } from '@mui/x-date-pickers';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  filterAndGetCustomers,
  getAllNewsletterTemplates
} from 'src/services/customerService';
import PreviewTemplateModal from 'src/components/customers/PreviewTemplateModal';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridValueGetterParams
} from '@mui/x-data-grid';
import FilterCustomersMenu from 'src/components/customers/FilterCustomersMenu';

export type NewScheduledNewsletter = Partial<ScheduledNewsletter> & {};

const columns: GridColDef[] = [
  {
    field: 'firstName',
    headerName: 'First Name',
    flex: 1
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    flex: 1
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1
  },
  {
    field: 'lastOrderDate',
    headerName: 'Last Order Date',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      let date = params.value;
      let valueFormatted = moment(date).format('DD/MM/YYYY');
      return valueFormatted;
    }
  },
  {
    field: 'totalSpent',
    headerName: 'All Time Order Value',
    flex: 1
  },
  {
    field: 'daysSinceLastPurchase',
    headerName: 'Days Since Last Purchase',
    flex: 1
  }
];

const ScheduleNewsletter = () => {
  const navigate = useNavigate();

  const [newsletterTemplates, setNewsletterTemplates] = React.useState<
    NewsletterTemplate[]
  >([]);
  const [newScheduledNewsletter, setNewScheduledNewsletter] =
    React.useState<NewScheduledNewsletter>();
  const [selectedNewsletterTemplate, setSelectedNewsletterTemplate] =
    React.useState<NewsletterTemplate>();
  const [selectedDate, setSelectedDate] = React.useState<Moment | null>(
    moment()
  );
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openPreviewModal, setOpenPreviewModal] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllNewsletterTemplates(),
      (res) => {
        setNewsletterTemplates(res);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      filterAndGetCustomers({}),
      (res) => {
        setCustomers(res);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const handleSelectNewsletter = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await setNewScheduledNewsletter((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });

    setSelectedNewsletterTemplate(
      newsletterTemplates.find(
        (template) => template.id.toString() == e.target.value
      )
    );
  };

  const onRowsSelectionHandler = (ids: GridRowId[]) => {
    const selectedRowsData = ids.map((id) =>
      customers.find((row) => row.id === id)
    );
    console.log(selectedRowsData);
  };

  const getFilteredCustomers = (customers: Customer[]) => {
    setCustomers(customers);
  };

  return (
    <div className='schedule-newsletter'>
      <div className='schedule-newsletter-heading'>
        <Tooltip title='Return to Previous Page' enterDelay={300}>
          <IconButton size='large' onClick={() => navigate(-1)}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <h1>Schedule Newsletter</h1>
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
      <Grid container spacing={2} className='schedule-newsletter-grid'>
        <Grid item xs={10} className='schedule-newsletter-grid-item'>
          <h3 className='schedule-newsletter-grid-label-text'>
            Newsletter Name:
          </h3>
          <TextField
            id='select-newsletter'
            name='newsletterId'
            label='Newsletter Name'
            value={newScheduledNewsletter?.newsletterId}
            onChange={handleSelectNewsletter}
            select
            fullWidth
            required
          >
            {newsletterTemplates.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <Grid item xs={2} className='schedule-newsletter-preview-button'>
            {selectedNewsletterTemplate && (
              <Button
                variant='contained'
                size='medium'
                sx={{ height: 'fit-content' }}
                onClick={() => setOpenPreviewModal(true)}
              >
                Preview
              </Button>
            )}
            <PreviewTemplateModal
              open={openPreviewModal}
              onClose={() => setOpenPreviewModal(false)}
              title={selectedNewsletterTemplate?.emailBodyTitle}
              body={selectedNewsletterTemplate?.emailBody}
              discountCode={selectedNewsletterTemplate?.discountCode}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6} className='schedule-newsletter-grid-item'>
          <h3 className='schedule-newsletter-grid-label-text'>Date to Send:</h3>
          <DateTimePicker
            label='Date to Send'
            value={selectedDate}
            minDate={moment()}
            onChange={(date) => setSelectedDate(moment(date))}
            renderInput={(params) => <TextField required {...params} />}
          />
        </Grid>
      </Grid>
      <Divider />
      <div className='schedule-newsletter-customers-toolbar'>
        <h2 className='schedule-newsletter-customers-heading'>Customers</h2>
        <FilterCustomersMenu updateCustomers={getFilteredCustomers} />
      </div>
      <div className='filter-customers-data-grid'>
        <DataGrid
          columns={columns}
          rows={customers}
          autoHeight
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        />
      </div>
    </div>
  );
};

export default ScheduleNewsletter;
