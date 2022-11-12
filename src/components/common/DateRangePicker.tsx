import { TextField, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { MomentRange, YYYY_MM_DD } from 'src/utils/dateUtils';

type DateRangePickerProps = {
  dateRange: MomentRange;
  updateDateRange: (newRange: (oldRange: MomentRange) => MomentRange) => void;
  canSelectPastDate?: boolean;
};

const DateRangePicker = ({
  dateRange,
  updateDateRange,
  canSelectPastDate = true
}: DateRangePickerProps) => {
  return (
    <>
      <DesktopDatePicker
        label='Start Date'
        value={dateRange[0].format(YYYY_MM_DD)}
        minDate={moment('2000-01-01')}
        shouldDisableDate={(date) =>
          moment(date).isAfter(dateRange[1]) ||
          (!canSelectPastDate && moment(date).isBefore(dateRange[0]))
        }
        onChange={(date) =>
          updateDateRange((prev) => [moment(date).startOf('day'), prev[1]])
        }
        renderInput={(params) => <TextField {...params} />}
      />
      <Typography className='container-center'>to</Typography>
      <DesktopDatePicker
        label='End Date'
        value={dateRange[1].format(YYYY_MM_DD)}
        maxDate={moment('2100-01-01')}
        shouldDisableDate={(date) => moment(date).isBefore(dateRange[0])}
        onChange={(date) =>
          updateDateRange((prev) => [prev[0], moment(date).endOf('day')])
        }
        renderInput={(params) => <TextField {...params} />}
      />
    </>
  );
};

export default DateRangePicker;