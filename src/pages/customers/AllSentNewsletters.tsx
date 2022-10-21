import React from 'react';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import '../../styles/pages/customer/customer.scss';
import { Stack, Typography } from '@mui/material';
import moment from 'moment';
import { JobStatus, ScheduledNewsletter } from 'src/models/types';
import { getScheduledNewslettersByDateRange } from 'src/services/customerService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
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
    field: 'name',
    headerName: 'Newsletter Name',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.newsletter.name
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

const SentNewsletters = () => {
  const [sentNewsletters, setSentNewsletters] = React.useState<
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
      getScheduledNewslettersByDateRange(dateRange, JobStatus.SENT),
      (res) => {
        const sortedData = res.sort((a, b) =>
          moment(a.sentDate).diff(b.sentDate)
        );
        setSentNewsletters(sortedData);
      }
    );
    setLoading(false);
  }, [dateRange]);

  return (
    <div className='view-newsletters'>
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>Sent Newsletters</h1>
        <Stack direction='row' spacing={2}>
          <Typography className='date-picker-text'>
            View newsletters sent from
          </Typography>
          <DateRangePicker
            dateRange={dateRange}
            updateDateRange={setDateRange}
          />
        </Stack>
      </Stack>
      <DataGrid
        columns={columns}
        rows={sentNewsletters}
        autoHeight
        loading={loading}
      />
    </div>
  );
};

export default SentNewsletters;
