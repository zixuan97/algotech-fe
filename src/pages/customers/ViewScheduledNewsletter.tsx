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
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip
} from '@mui/material';
import moment, { Moment } from 'moment';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import { Customer, NewsletterTemplate } from 'src/models/types';
import { getAllNewsletterTemplates } from 'src/services/customerService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridValueGetterParams
} from '@mui/x-data-grid';
import FilterCustomersMenu from 'src/components/customers/FilterCustomersMenu';

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

const customers: Customer[] = [];

const ViewScheduledNewsletter = () => {
  const navigate = useNavigate();

  const [newsletterTemplates, setNewsletterTemplates] = React.useState<
    NewsletterTemplate[]
  >([]);
  const [updatedDate, setUpdatedDate] = React.useState<Moment>(
    moment().startOf('day')
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [filteredCustomers, setFilteredCustomers] = React.useState<Customer[]>(
    []
  );

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

  const onRowsSelectionHandler = (ids: GridRowId[]) => {
    const selectedRowsData = ids.map((id) =>
      customers.find((row) => row.id === id)
    );
    console.log(selectedRowsData);
  };

  const getFilteredCustomers = (customers: Customer[]) => {
    setFilteredCustomers(customers);
  };

  return (
    <div className='view-scheduled-newsletter'>
      <div className='view-scheduled-newsletter-top-section'>
        <div className='view-scheduled-newsletter-heading'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>View Scheduled Newsletter ID: #1</h1>
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
        <div className='view-newsletter-template-edit-button-container'>
          <Button
            variant='contained'
            onClick={() => {
              if (!edit) {
                setEdit(true);
              } else {
                // handleNewsletterTemplateUpdate();
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
            onConfirm={() => {}}
            title='Delete Scheduled Newsletter'
            body='Are you sure you want to delete this scheduled newsletter? This action cannot be reversed.'
          />
          {edit && (
            <Button
              variant='contained'
              size='medium'
              sx={{ width: 'fit-content' }}
              onClick={() => {}}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      <Grid container spacing={2} className='view-scheduled-newsletter-grid'>
        <Grid item xs={10} className='view-scheduled-newsletter-grid-item'>
          <h3 className='view-scheduled-newsletter-grid-label-text'>
            Newsletter Name:
          </h3>
          {!edit ? (
            <TextField
              label='Newsletter Name'
              value='Christmas 2022'
              variant='filled'
              disabled
              fullWidth
            />
          ) : (
            <TextField
              id='select-newsletter'
              name='newsletterId'
              label='Newsletter Name'
              value=''
              onChange={() => {}}
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
          )}
          <Grid
            item
            xs={2}
            className='view-scheduled-newsletter-preview-button'
          >
            <Button
              variant='contained'
              size='medium'
              sx={{ height: 'fit-content' }}
              onClick={() => {}}
            >
              Preview
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6} className='view-scheduled-newsletter-grid-item'>
          <h3 className='view-scheduled-newsletter-grid-label-text'>
            Date to Send:
          </h3>
          {!edit ? (
            <TextField
              label='Date to Send'
              value='17/10/2022'
              variant='filled'
              disabled
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <EventIcon />
                  </InputAdornment>
                )
              }}
            />
          ) : (
            <DesktopDatePicker
              label='Date to Send'
              value={updatedDate}
              minDate={moment().startOf('day')}
              onChange={(date) => setUpdatedDate(moment(date))}
              renderInput={(params) => <TextField required {...params} />}
            />
          )}
        </Grid>
      </Grid>
      <Divider />
      <h2 className='schedule-newsletter-customers-heading'>
        Current Customers
      </h2>
      <div className='customers-data-grid'>
        <DataGrid
          columns={columns}
          rows={customers}
          autoHeight
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
      {edit && <Divider />}
      {edit && (
        <div className='schedule-newsletter-customers-toolbar'>
          <h2 className='schedule-newsletter-customers-heading'>
            Add New Customers
          </h2>
          <FilterCustomersMenu updateCustomers={getFilteredCustomers} />
        </div>
      )}
      {edit && (
        <div className='customers-data-grid'>
          <DataGrid
            columns={columns}
            rows={filteredCustomers}
            autoHeight
            loading={loading}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
          />
        </div>
      )}
    </div>
  );
};

export default ViewScheduledNewsletter;
