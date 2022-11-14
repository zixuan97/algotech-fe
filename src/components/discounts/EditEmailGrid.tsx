import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModesModel,
  GridRowModes,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  DataGrid
} from '@mui/x-data-grid';
import EmailEditCellAction from './EmailEditCellAction';
import { toPairs } from 'lodash';
import {
  EmailGridRow,
  convertEmailToGridRow,
  convertGridRowToEmail,
  EditToolbar
} from './discountHelper';
import { getAllCustomers } from 'src/services/customerService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';

type EmailEditGridProps = {
  emails: string[];
  updateEmails: (emails: string[]) => void;
};

export default function EditEmailGrid({
  emails,
  updateEmails
}: EmailEditGridProps) {
  const [emailGridRows, setEmailGridRows] = React.useState<EmailGridRow[]>(
    convertEmailToGridRow(emails)
  );
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [customersEmails, setCustomersEmails] = React.useState<string[]>([]);
  const [originalEmails, setOriginalEmails] = React.useState<string[]>([]);
  const [invalidField, setInvalidField] = React.useState<boolean>(true);

  React.useEffect(() => {
    asyncFetchCallback(getAllCustomers(), (res) => {
      setCustomersEmails(
        res.map((customer) => {
          return customer.email;
        })
      );
      setOriginalEmails(
        res.map((customer) => {
          return customer.email;
        })
      );
    });
  }, []);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId, email: string) => () => {
    setInvalidField(true);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId, email: string) => () => {
    const updatedEmailsRows = emailGridRows.filter((row) => row.gridId !== id);
    setEmailGridRows(updatedEmailsRows);
    updateEmails(convertGridRowToEmail(updatedEmailsRows));
    originalEmails.includes(email) && !customersEmails.includes(email) &&
      setCustomersEmails((prev) => [...prev, email]);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = emailGridRows.find((row) => row.gridId === id);
    if (editedRow!.isNew) {
      setEmailGridRows(emailGridRows.filter((row) => row.gridId !== id));
    }
  };

  const processRowUpdate = (newRow: EmailGridRow) => {
    const updatedRow = {
      ...newRow,
      isNew: false
    };
    const updatedEmailGridRows = emailGridRows.map((row) =>
      row.gridId === newRow.gridId ? updatedRow : row
    );
    setEmailGridRows(updatedEmailGridRows);
    updateEmails(convertGridRowToEmail(updatedEmailGridRows));
    return updatedRow;
  };

  const columns: GridColumns = [
    {
      field: 'email',
      headerName: 'Customer Emails',
      headerAlign: 'center',
      flex: 1,
      editable: true,
      valueGetter: (params) => params.row.email,
      renderEditCell: (params) => (
        <EmailEditCellAction
          emails={emails}
          params={params}
          customersEmails={customersEmails}
          setCustomersEmails={setCustomersEmails}
          setInvalidField={setInvalidField}
        />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              onClick={handleSaveClick(id, row.email)}
              disabled={invalidField}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />
          ];
        }
        const anyCellEditing = toPairs(rowModesModel).some(
          (row) => row[0] !== id && row[1].mode === GridRowModes.Edit
        );

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            disabled={anyCellEditing}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            disabled={anyCellEditing}
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id, row.email)}
            color='inherit'
          />
        ];
      }
    }
  ];

  return (
    <DataGrid
      rows={emailGridRows}
      getRowId={(row) => row.gridId}
      columns={columns}
      editMode='row'
      rowModesModel={rowModesModel}
      onRowEditStart={handleRowEditStart}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      components={{
        Toolbar: EditToolbar
      }}
      componentsProps={{
        toolbar: {
          setRows: setEmailGridRows,
          setRowModesModel,
          disableAdd: emailGridRows.some((row) => row.isNew)
        }
      }}
      experimentalFeatures={{ newEditingApi: true }}
      autoHeight
    />
  );
}
