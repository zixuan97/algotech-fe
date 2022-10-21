import React from 'react';
import { useNavigate } from 'react-router';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import '../../styles/pages/customer/customer.scss';
import { Button, Chip, ChipProps, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { JobStatus, ScheduledNewsletter } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getScheduledNewslettersByDateRange } from 'src/services/customerService';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams
} from '@mui/x-data-grid';
import ScheduledNewsletterCellAction from 'src/components/customers/ScheduledNewsletterCellAction';

function getChipProps(params: GridRenderCellParams): ChipProps {
  return {
    label: params.value
  };
}

const columns: GridColDef[] = [
  {
    field: 'sentDate',
    headerName: 'Scheduled Date',
    width: 200,
    valueGetter: (params: GridValueGetterParams) => {
      let date = params.value;
      let valueFormatted = moment(date).format('DD/MM/YYYY HH:mm');
      return valueFormatted;
    }
  },
  {
    field: 'name',
    headerName: 'Newsletter Name',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.newsletter.name
  },
  {
    field: 'jobStatus',
    headerName: 'Status',
    width: 140,
    renderCell: (params) => {
      return (
        <Chip {...getChipProps(params)} style={{ fontFamily: 'Poppins' }} />
      );
    }
  },
  {
    field: 'emailSubject',
    headerName: 'Email Subject',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.newsletter.emailSubject
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

const ScheduledNewsletters = () => {
  const navigate = useNavigate();

  const [scheduledNewsletters, setScheduledNewsletters] = React.useState<
    ScheduledNewsletter[]
  >([]);
  const [allNewsletters, setAllNewsletters] = React.useState<
    ScheduledNewsletter[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('month'),
    moment().endOf('day')
  ]);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getScheduledNewslettersByDateRange(dateRange, JobStatus.SCHEDULED),
      (res) => {
        const sortedData = res.sort((a, b) =>
          moment(a.sentDate).diff(b.sentDate)
        );
        setScheduledNewsletters(sortedData);
      }
    );
    setLoading(false);
  }, [dateRange]);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getScheduledNewslettersByDateRange(dateRange, JobStatus.CANCELLED),
      (res) => {
        const allData = res.concat(scheduledNewsletters);
        const sortedData = allData.sort((a, b) =>
          moment(a.sentDate).diff(b.sentDate)
        );
        setAllNewsletters(sortedData);
      }
    );
    setLoading(false);
  }, [dateRange, scheduledNewsletters]);

  return (
    <div className='view-newsletters'>
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>Scheduled Newsletters</h1>
        <Stack direction='row' spacing={2}>
          <Typography className='date-picker-text'>
            View newsletters scheduled from
          </Typography>
          <DateRangePicker
            dateRange={dateRange}
            updateDateRange={setDateRange}
          />
        </Stack>
      </Stack>
      <div className='scheduled-newsletters-toolbar'>
        <Button
          variant='contained'
          size='medium'
          sx={{ height: 'fit-content' }}
          onClick={() => navigate({ pathname: '/customer/scheduleNewsletter' })}
        >
          Schedule Newsletter
        </Button>
      </div>
      <DataGrid
        columns={columns}
        rows={allNewsletters}
        autoHeight
        loading={loading}
      />
    </div>
  );
};

export default ScheduledNewsletters;
