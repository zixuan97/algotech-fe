import * as React from 'react';
import { AlertColor, Alert as MuiAlert } from '@mui/material';
import { useLocation } from 'react-router';

export interface AxiosErrDataBody {
  message: string;
}

export interface AlertType {
  severity: AlertColor;
  message: string;
}

type AlertProps = {
  alert: AlertType | null;
  clearAlert: () => void;
  timeout?: number;
};

const TimeoutAlert = ({ alert, clearAlert, timeout = 3000 }: AlertProps) => {
  const location = useLocation();
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout>();

  React.useEffect(() => {
    if (alert) {
      setTimeoutId(
        setTimeout(() => {
          clearAlert();
        }, timeout)
      );
    }
  }, [alert, clearAlert, timeout]);

  // clear timeout on component unmount
  React.useEffect(() => () => clearTimeout(timeoutId), [location, timeoutId]);

  return (
    alert && (
      <MuiAlert severity={alert.severity} onClose={clearAlert}>
        {alert.message}
      </MuiAlert>
    )
  );
};

export default TimeoutAlert;
