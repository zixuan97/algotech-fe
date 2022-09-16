import * as React from 'react';
import { AlertColor, Alert as MuiAlert } from '@mui/material';

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
  React.useEffect(() => {
    if (alert) {
      setTimeout(() => {
        clearAlert();
      }, timeout);
    }
  }, [alert, clearAlert, timeout]);
  return (
    alert && (
      <MuiAlert severity={alert.severity} onClose={clearAlert}>
        {alert.message}
      </MuiAlert>
    )
  );
};

export default TimeoutAlert;
