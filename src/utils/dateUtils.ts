import moment from 'moment';

export const DDMMYYYY = 'DDMMYYYY';

export const getTodayFormattedDate = (format: string) => {
  return moment().format(format);
};
