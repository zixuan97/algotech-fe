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
import { DateTimePicker } from '@mui/x-date-pickers';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import {
  Customer,
  NewsletterTemplate,
  ScheduledNewsletter
} from 'src/models/types';
import {
  editScheduledNewsletter,
  getAllCustomers,
  getAllNewsletterTemplates,
  getScheduledNewsletterById
} from 'src/services/customerService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridValueGetterParams
} from '@mui/x-data-grid';
import FilterCustomersMenu from 'src/components/customers/FilterCustomersMenu';
import { useSearchParams } from 'react-router-dom';
import PreviewTemplateModal from 'src/components/customers/PreviewTemplateModal';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewScheduledNewsletter = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [originalScheduledNewsletter, setOriginalScheduledNewsletter] =
    React.useState<ScheduledNewsletter>();
  const [updatedScheduledNewsletter, setUpdatedScheduledNewsletter] =
    React.useState<ScheduledNewsletter>();
  const [newsletterTemplates, setNewsletterTemplates] = React.useState<
    NewsletterTemplate[]
  >([]);
  const [selectedDate, setSelectedDate] = React.useState<Moment | null>();
  const [allCustomers, setAllCustomers] = React.useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = React.useState<Customer[]>(
    []
  );
  const [notSelectedCustomers, setNotSelectedCustomers] = React.useState<
    Customer[]
  >([]);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [openPreviewModal, setOpenPreviewModal] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllCustomers(),
      (res) => {
        setAllCustomers(res);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    if (id && allCustomers) {
      setLoading(true);
      asyncFetchCallback(
        getScheduledNewsletterById(id),
        (res) => {
          setOriginalScheduledNewsletter(res);
          setUpdatedScheduledNewsletter(res);
          setSelectedDate(moment(originalScheduledNewsletter?.sentDate));

          let currentCustomers = originalScheduledNewsletter?.customerEmails;

          setSelectedCustomers(
            allCustomers.filter((cust) =>
              currentCustomers?.includes(cust.email)
            )
          );
          setNotSelectedCustomers(
            allCustomers.filter(
              (cust) => !currentCustomers?.includes(cust.email)
            )
          );

          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [id, allCustomers]);

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

  const onRowsSelectionHandler = async (ids: GridRowId[]) => {
    let currentEmails = updatedScheduledNewsletter?.customerEmails;
    let newEmails: String[] = [];

    await ids.forEach((id) => {
      let customer = allCustomers.find((cust) => cust.id === id);
      if (!currentEmails?.includes(customer!.email)) {
        newEmails.push(customer!.email);
        setSelectedCustomers((prevRows) => [...prevRows, customer!]);
      }
    });

    await setUpdatedScheduledNewsletter((prev) => {
      if (prev) {
        return { ...prev, customerEmails: currentEmails!.concat(newEmails) };
      } else {
        return prev;
      }
    });

    await setNotSelectedCustomers(
      notSelectedCustomers.filter((cust) => !newEmails?.includes(cust.email))
    );
  };

  const handleRemoveCustomer = async (id: string) => {
    let currentEmails = updatedScheduledNewsletter?.customerEmails;

    let customer = allCustomers.find((cust) => cust.id === Number(id));
    currentEmails = currentEmails?.filter((email) => email !== customer!.email);
    setSelectedCustomers((prevRows) =>
      prevRows.filter((row) => row.email !== customer!.email)
    );

    await setUpdatedScheduledNewsletter((prev) => {
      if (prev) {
        return { ...prev, customerEmails: currentEmails! };
      } else {
        return prev;
      }
    });

    await setNotSelectedCustomers((prevCustomers) => [
      ...prevCustomers,
      customer!
    ]);
  };

  const getFilteredCustomers = (customers: Customer[]) => {
    let currentSelectedCustomers = updatedScheduledNewsletter?.customerEmails;

    setNotSelectedCustomers(
      customers.filter(
        (cust) => !currentSelectedCustomers?.includes(cust.email)
      )
    );
  };

  const handleEditNewsletterTemplate = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let selectedNewsletter = newsletterTemplates.find(
      (newsletter) => newsletter.id.toString() == e.target.value
    );

    await setUpdatedScheduledNewsletter((prev) => {
      if (prev) {
        return { ...prev, newsletter: selectedNewsletter! };
      } else {
        return prev;
      }
    });
  };

  const handleCancelUpdate = async () => {
    let originalEmails = originalScheduledNewsletter?.customerEmails;

    await setSelectedCustomers(
      allCustomers.filter((cust) => originalEmails?.includes(cust.email))
    );
    await setNotSelectedCustomers(
      allCustomers.filter((cust) => !originalEmails?.includes(cust.email))
    );
    await setUpdatedScheduledNewsletter((prev) => {
      if (prev) {
        return {
          ...prev,
          newsletter: originalScheduledNewsletter!.newsletter,
          customerEmails: originalEmails!,
          sentDate: originalScheduledNewsletter!.sentDate
        };
      } else {
        return prev;
      }
    });
    setSelectedDate(moment(originalScheduledNewsletter?.sentDate));
    setEdit(false);
  };

  const handleScheduledNewsletterUpdate = async () => {
    setLoading(true);

    let reqBody = {
      id: updatedScheduledNewsletter?.id,
      jobId: updatedScheduledNewsletter?.jobId,
      newsletterId: updatedScheduledNewsletter?.newsletter.id,
      customerEmails: updatedScheduledNewsletter?.customerEmails,
      sentDate: selectedDate?.toISOString()
    };

    await asyncFetchCallback(
      editScheduledNewsletter(reqBody),
      (res) => {
        setOriginalScheduledNewsletter((originalScheduledNewsletter) => {
          if (originalScheduledNewsletter) {
            return {
              ...originalScheduledNewsletter,
              newsletterId: updatedScheduledNewsletter!.newsletter.id,
              newsletter: updatedScheduledNewsletter!.newsletter,
              customerEmails: updatedScheduledNewsletter!.customerEmails,
              sentDate: selectedDate!.toDate()
            };
          } else {
            return originalScheduledNewsletter;
          }
        });
        setAlert({
          severity: 'success',
          message: 'Scheduled Newsletter updated successfully.'
        });
        setLoading(false);
        setEdit(false);
      },
      (err) => {
        setLoading(false);
        setAlert({
          severity: 'error',
          message: 'Scheduled Newsletter was not updated successfully.'
        });
        setEdit(false);
      }
    );
  };

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
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ id }: GridRenderCellParams) => {
        return (
          <Button
            variant='outlined'
            startIcon={<DeleteIcon />}
            onClick={() => handleRemoveCustomer(id.toString())}
          >
            Delete
          </Button>
        );
      }
    }
  ];

  return (
    <div className='view-scheduled-newsletter'>
      <div className='view-scheduled-newsletter-top-section'>
        <div className='view-scheduled-newsletter-heading'>
          <Tooltip title='Return to Previous Page' enterDelay={300}>
            <IconButton size='large' onClick={() => navigate(-1)}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <h1>View Scheduled Newsletter ID: #{id}</h1>
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
                handleScheduledNewsletterUpdate();
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
              onClick={handleCancelUpdate}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      {alert && (
        <div className='newsletter-alert'>
          <TimeoutAlert
            alert={alert}
            timeout={6000}
            clearAlert={() => setAlert(null)}
          />
        </div>
      )}
      <Grid container spacing={2} className='view-scheduled-newsletter-grid'>
        <Grid item xs={10} className='view-scheduled-newsletter-grid-item'>
          <h3 className='view-scheduled-newsletter-grid-label-text'>
            Newsletter Name:
          </h3>
          {!edit ? (
            <TextField
              label='Newsletter Name'
              value={originalScheduledNewsletter?.newsletter.name}
              variant='filled'
              InputLabelProps={{ shrink: true }}
              disabled
              fullWidth
            />
          ) : (
            <TextField
              id='select-newsletter'
              name='newsletterId'
              label='Newsletter Name'
              value={updatedScheduledNewsletter?.newsletter.id}
              onChange={handleEditNewsletterTemplate}
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
              onClick={() => setOpenPreviewModal(true)}
            >
              Preview
            </Button>
            <PreviewTemplateModal
              open={openPreviewModal}
              onClose={() => setOpenPreviewModal(false)}
              title={updatedScheduledNewsletter?.newsletter.emailBodyTitle}
              body={updatedScheduledNewsletter?.newsletter.emailBody}
              discountCode={updatedScheduledNewsletter?.newsletter.discountCode}
            />
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
              value={moment(originalScheduledNewsletter?.sentDate).format(
                'MM/DD/YYYY HH:mm A'
              )}
              variant='filled'
              disabled
              style={{ width: 250 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <EventIcon />
                  </InputAdornment>
                )
              }}
            />
          ) : (
            <DateTimePicker
              label='Date to Send'
              value={selectedDate}
              // minDate={moment()}
              onChange={(date) => setSelectedDate(moment(date))}
              renderInput={(params) => (
                <TextField style={{ width: 250 }} required {...params} />
              )}
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
          columns={edit ? columns : columns.splice(0, 6)}
          rows={selectedCustomers}
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
            rows={notSelectedCustomers}
            autoHeight
            loading={loading}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  actions: false
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ViewScheduledNewsletter;
