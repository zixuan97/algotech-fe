import { Add, Email } from '@mui/icons-material';
import { Button } from '@mui/material';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridToolbarContainer
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { color } from 'html2canvas/dist/types/css/types/color';

export interface EmailGridRow {
  email: string;
  gridId: string;
  isNew?: boolean;
}

export const convertEmailToGridRow = (emails: string[]): EmailGridRow[] => {
  return emails.map((email) => ({ email, gridId: randomId() }));
};

export const convertGridRowToEmail = (
  emailGridRows: EmailGridRow[]
): string[] => {
  return emailGridRows.map((row) => row.email);
};

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  disableAdd: boolean;
}

export function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, disableAdd } = props;

  const handleClick = () => {
    const gridId = randomId();
    setRows((oldRows) => [...oldRows, { gridId, email: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [gridId]: { mode: GridRowModes.Edit, fieldToFocus: 'email' }
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color='primary' startIcon={<Add />} onClick={handleClick} disabled={disableAdd}>
        Add Email
      </Button>
    </GridToolbarContainer>
  );
}
