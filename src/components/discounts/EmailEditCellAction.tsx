import { Autocomplete, TextField, Tooltip } from '@mui/material';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import React from 'react';
import validator from 'validator';

type EmailEditCellActionProps = {
  params: GridRenderEditCellParams<string>;
  emails: string[];
  customersEmails: string[];
  setCustomersEmails: (emails: string[]) => void;
  setInvalidField: (bool: boolean) => void;
};

const EmailEditCellAction = ({
  params,
  customersEmails,
  setCustomersEmails,
  setInvalidField,
  emails
}: EmailEditCellActionProps) => {
  const { id: gridId, field, value } = params;

  const apiRef = useGridApiContext();

  const handleChange = (str: string) => {
    apiRef.current.setEditCellValue({
      id: gridId,
      field,
      value: str
    });
    setCustomersEmails(customersEmails.filter((email) => email !== str));
  };

  return (
    <>
      <Autocomplete
        style={{ marginLeft: '1%', width: '100%' }}
        freeSolo
        fullWidth
        onChange={(event: any, newValue: string | null) => {
          if (newValue && !emails.includes(newValue!)) {
            setInvalidField(false);
          }
          newValue && handleChange(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          handleChange(newInputValue);
          if (
            !emails.includes(newInputValue) &&
            validator.isEmail(newInputValue)
          ) {
            return setInvalidField(false);
          } else {
            return setInvalidField(true);
          }
        }}
        value={value}
        size='small'
        id='combo-box-demo'
        options={customersEmails}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <Tooltip title='Kindly ensure no duplicate emails' enterDelay={100}>
            <span>
              <TextField {...params} />
            </span>
          </Tooltip>
        )}
      />
    </>
  );
};

export default React.memo(EmailEditCellAction);
