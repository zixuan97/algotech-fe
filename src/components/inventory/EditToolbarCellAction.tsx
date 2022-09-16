import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer
} from '@mui/x-data-grid';
import {
  ProductLocation,
  ProductLocationRow
} from 'src/pages/inventory/CreateProduct';
import { Location } from 'src/models/types';
import { randomId } from '@mui/x-data-grid-generator';

interface EditToolbarProps {
  setRows: (
    newRows: (oldRows: ProductLocationRow[]) => ProductLocationRow[]
  ) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  availableLocations: Location[];
}

const EditToolbarCellAction = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel, availableLocations } = props;

  const handleClick = () => {
    const gridId = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        gridId,
        id: availableLocations[0].id,
        name: availableLocations[0].name,
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
        disabled={!availableLocations.length}
      >
        Add warehouse
      </Button>
    </GridToolbarContainer>
  );
};

export default EditToolbarCellAction;
