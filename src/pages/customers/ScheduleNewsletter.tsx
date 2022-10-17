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
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Customer,
  NewsletterTemplate,
  ScheduledNewsletter
} from 'src/models/types';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import moment, { Moment } from 'moment';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  filterAndGetCustomers,
  getAllNewsletterTemplates
} from 'src/services/customerService';
import PreviewTemplateModal from 'src/components/customers/PreviewTemplateModal';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridValueGetterParams
} from '@mui/x-data-grid';

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
  const [selectedDate, setSelectedDate] = React.useState<Moment>(
    moment().startOf('day')
  );
  const [daysSinceLastPurchaseString, setDaysSinceLastPurchase] =
    React.useState<string>('');
  const [allTimeOrderValueString, setAllTimeOrderValue] =
    React.useState<string>('');
  const [minAvgOrderValueString, setMinAvgOrderValue] =
    React.useState<string>('');
  const [maxAvgOrderValueString, setMaxAvgOrderValue] =
    React.useState<string>('');
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
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

  const handleEditCustomerFilters = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.name === 'daysSinceLastPurchase') {
      await setDaysSinceLastPurchase(e.target.value);
    } else if (e.target.name === 'allTimeOrderValue') {
      await setAllTimeOrderValue(e.target.value);
    } else if (e.target.name === 'minAvgOrderValue') {
      await setMinAvgOrderValue(e.target.value);
    } else {
      await setMaxAvgOrderValue(e.target.value);
    }
  };

  const handleFilterCustomers = async () => {
    let daysSinceLastPurchase = Number(daysSinceLastPurchaseString);
    let allTimeOrderValue = Number(allTimeOrderValueString);
    let minAvgOrderValue = Number(minAvgOrderValueString);
    let maxAvgOrderValue = Number(maxAvgOrderValueString);

    if (
      (daysSinceLastPurchaseString !== '' && daysSinceLastPurchase < 0) ||
      (allTimeOrderValueString !== '' && allTimeOrderValue < 0) ||
      (minAvgOrderValueString !== '' && minAvgOrderValue < 0) ||
      (maxAvgOrderValueString !== '' && maxAvgOrderValue < 0)
    ) {
      setAlert({
        severity: 'warning',
        message: 'All filter values must be positive!'
      });
      return;
    }

    if (minAvgOrderValueString !== '' && maxAvgOrderValueString === '') {
      setAlert({
        severity: 'warning',
        message: 'Please enter a max average order value!'
      });
      return;
    }

    if (maxAvgOrderValueString !== '' && minAvgOrderValueString === '') {
      setAlert({
        severity: 'warning',
        message: 'Please enter a min average order value!'
      });
      return;
    }

    if (minAvgOrderValue > maxAvgOrderValue) {
      setAlert({
        severity: 'warning',
        message:
          'Please ensure min average order value is less than max average order value!'
      });
      return;
    }

    let reqBody = Object.assign(
      {},
      daysSinceLastPurchase && { daysSinceLastPurchase },
      allTimeOrderValue && { allTimeOrderValue },
      minAvgOrderValue && { minAvgOrderValue },
      maxAvgOrderValue && { maxAvgOrderValue }
    );

    setLoading(true);

    await asyncFetchCallback(
      filterAndGetCustomers(reqBody),
      (res) => {
        setCustomers(res);
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  const clearFilters = async () => {
    await setDaysSinceLastPurchase('');
    await setAllTimeOrderValue('');
    await setMinAvgOrderValue('');
    await setMaxAvgOrderValue('');

    await asyncFetchCallback(
      filterAndGetCustomers({}),
      (res) => {
        setCustomers(res);
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  const onRowsSelectionHandler = (ids: GridRowId[]) => {
    const selectedRowsData = ids.map((id) =>
      customers.find((row) => row.id === id)
    );
    console.log(selectedRowsData);
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
      <Grid container spacing={2}>
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
          <DesktopDatePicker
            label='Date to Send'
            value={selectedDate}
            minDate={moment().startOf('day')}
            onChange={(date) => setSelectedDate(moment(date))}
            renderInput={(params) => <TextField required {...params} />}
          />
        </Grid>
      </Grid>
      <Divider />
      <div className='filter-customers-alert'>
        <TimeoutAlert
          alert={alert}
          timeout={6000}
          clearAlert={() => setAlert(null)}
        />
      </div>
      <div className='schedule-newsletter-customers-toolbar'>
        <h2 className='schedule-newsletter-customers-heading'>Customers</h2>
        <Stack
          direction='row'
          width='100%'
          alignItems='center'
          justifyContent='flex-end'
        >
          <Stack
            direction='column'
            spacing={2}
            paddingLeft='2rem'
            paddingRight='2rem'
          >
            <Typography>Days Since Last Purchase</Typography>
            <TextField
              name='daysSinceLastPurchase'
              type='number'
              value={daysSinceLastPurchaseString}
              onChange={handleEditCustomerFilters}
              fullWidth
            />
          </Stack>
          <Stack
            direction='column'
            spacing={2}
            paddingLeft='2rem'
            paddingRight='2rem'
          >
            <Typography>All Time Order Value</Typography>
            <TextField
              name='allTimeOrderValue'
              type='number'
              value={allTimeOrderValueString}
              onChange={handleEditCustomerFilters}
              fullWidth
            />
          </Stack>
          <Stack
            direction='column'
            spacing={2}
            paddingLeft='2rem'
            paddingRight='2rem'
          >
            <Typography>Average Order Value</Typography>
            <Stack direction='row' spacing={2} alignItems='center'>
              <TextField
                name='minAvgOrderValue'
                label='Min'
                type='number'
                value={minAvgOrderValueString}
                onChange={handleEditCustomerFilters}
                fullWidth
              />
              <Typography>to</Typography>
              <TextField
                name='maxAvgOrderValue'
                label='Max'
                type='number'
                value={maxAvgOrderValueString}
                onChange={handleEditCustomerFilters}
                fullWidth
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack
          direction='row'
          spacing={2}
          alignItems='center'
          paddingTop='3rem'
        >
          <Button
            variant='outlined'
            startIcon={<FilterAltIcon />}
            size='medium'
            sx={{ height: 'fit-content' }}
            onClick={handleFilterCustomers}
          >
            Filter
          </Button>
          <Button
            variant='outlined'
            startIcon={<ClearIcon />}
            size='medium'
            sx={{ height: 'fit-content' }}
            onClick={clearFilters}
          >
            Clear
          </Button>
        </Stack>
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
