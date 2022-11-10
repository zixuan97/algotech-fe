import { TextField, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { DiscountCode } from 'src/models/types';
import { YYYY_MM_DD } from 'src/utils/dateUtils';

type DateRangePickerProps = {
  radioValue: string;
  newDiscountCode?: Partial<DiscountCode>;
  setNewDiscountCode: (discountCode: Partial<DiscountCode>) => void;
};

const DiscountDateRange = ({
  radioValue,
  newDiscountCode,
  setNewDiscountCode
}: DateRangePickerProps) => {
  return (
    <>
      <DesktopDatePicker
        label='Start Date'
        value={moment(newDiscountCode?.startDate).format(YYYY_MM_DD)}
        minDate={moment('2000-01-01')}
        shouldDisableDate={(date) =>
          moment(date).isBefore(moment().startOf('day'))
        }
        onChange={(date) => {
          setNewDiscountCode({
            ...newDiscountCode,
            startDate: moment(date).startOf('day').toDate()
          });
        }}
        renderInput={(params) => <TextField {...params} />}
      />

      {radioValue === 'fixed' && (
        <>
          <Typography className='container-center'>to</Typography>
          <DesktopDatePicker
            disabled={radioValue !== 'fixed'}
            label='End Date'
            value={moment(newDiscountCode?.endDate).format(YYYY_MM_DD)}
            maxDate={moment('2100-01-01')}
            shouldDisableDate={(date) =>
              moment(date).isBefore(newDiscountCode?.startDate)
            }
            onChange={(date) => {
              setNewDiscountCode({
                ...newDiscountCode,
                endDate: moment(date).endOf('day').toDate()
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </>
      )}
    </>
  );
};

export default DiscountDateRange;
