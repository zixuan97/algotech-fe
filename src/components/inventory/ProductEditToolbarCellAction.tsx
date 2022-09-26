import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer
} from '@mui/x-data-grid';
import { BundleProductRow } from 'src/pages/inventory/CreateBundle';
import { Product } from 'src/models/types';
import { randomId } from '@mui/x-data-grid-generator';
import { BundleProductGridRow } from './inventoryHelper';

interface ProductEditToolbarProps {
  setRows: (
    newRows: (oldRows: BundleProductGridRow[]) => BundleProductGridRow[]
  ) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  availableProducts: Product[];
  disableAdd: boolean;
}

const ProductEditToolbarCellAction = ({
  setRows,
  setRowModesModel,
  availableProducts,
  disableAdd
}: ProductEditToolbarProps) => {
  const handleClick = () => {
    const gridId = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        gridId,
        isNew: true,

        product: availableProducts[0],
        productId: availableProducts[0].id

        // id: availableProducts[0].id,
        // sku: availableProducts[0].sku,
        // name: availableProducts[0].name,
        // image: availableProducts[0].image,
        // qtyThreshold: availableProducts[0].qtyThreshold,
        // brandId: availableProducts[0].brand.id,

        // categories: availableProducts[0].categories,
        // stockQuantity: availableProducts[0].stockQuantity
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

export default ProductEditToolbarCellAction;
