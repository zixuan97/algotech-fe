import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer
} from '@mui/x-data-grid';
import { Product } from 'src/models/types';
import { randomId } from '@mui/x-data-grid-generator';
import { SupplierProductGridRow } from './procurementHelper';

interface SupplierProductEditToolbarProps {
  setRows: (
    newRows: (oldRows: SupplierProductGridRow[]) => SupplierProductGridRow[]
  ) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  availableProducts: Product[];
  disableAdd: boolean;
}

const SupplierProductEditToolbarCellAction = ({
  setRows,
  setRowModesModel,
  availableProducts,
  disableAdd
}: SupplierProductEditToolbarProps) => {
  const handleClick = () => {
    const gridId = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        gridId,
        isNew: true,

        product: availableProducts[0],
        rate: 0
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
        disabled={!availableProducts.length || disableAdd}
      >
        Add Product
      </Button>
    </GridToolbarContainer>
  );
};

export default SupplierProductEditToolbarCellAction;
