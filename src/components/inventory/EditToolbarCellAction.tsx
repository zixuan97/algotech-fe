import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer
} from '@mui/x-data-grid';
import { ProductLocationRow } from 'src/pages/inventory/CreateProduct';
import { Location } from 'src/models/types';
import { randomId } from '@mui/x-data-grid-generator';
import { StockQuantityGridRow } from './inventoryHelper';

interface EditToolbarProps {
  setRows: (
    newRows: (oldRows: StockQuantityGridRow[]) => StockQuantityGridRow[]
  ) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  availableLocations: Location[];
  disableAdd: boolean;
}

const EditToolbarCellAction = ({
  setRows,
  setRowModesModel,
  availableLocations,
  disableAdd
}: EditToolbarProps) => {
  const handleClick = () => {
    const gridId = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        gridId,
        location: availableLocations[0],
        price: 0,
        quantity: 0,
        isNew: true
      }
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [gridId]: { mode: GridRowModes.Edit, fieldToFocus: 'id' }
    }));
  };

  return (
    <GridToolbarContainer>
      <Button
        color='primary'
        startIcon={<AddIcon />}
        onClick={handleClick}
        disabled={!availableLocations.length || disableAdd}
      >
        Add warehouse
      </Button>
    </GridToolbarContainer>
  );
};

export default EditToolbarCellAction;
