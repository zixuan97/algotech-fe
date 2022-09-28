import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer
} from '@mui/x-data-grid';
import { Product, Bundle, BundleProduct } from 'src/models/types';
import { randomId } from '@mui/x-data-grid-generator';
import { BundleProductGridRow } from './inventoryHelper';

interface BundleProductEditToolbarProps {
  setRows: (
    newRows: (oldRows: BundleProductGridRow[]) => BundleProductGridRow[]
  ) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  availableProducts: Product[];
  disableAdd: boolean;
}

const BundleProductEditToolbarCellAction = ({
  setRows,
  setRowModesModel,
  availableProducts,
  disableAdd
}: BundleProductEditToolbarProps) => {
  const handleClick = () => {
    const gridId = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        gridId,
        isNew: true,

        product: availableProducts[0],
        productId: availableProducts[0].id,
        quantity: 0
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

export default BundleProductEditToolbarCellAction;
