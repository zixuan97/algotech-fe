import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import { unionWith } from 'lodash';
import { Product } from 'src/models/types';

type ProductSelectCellActionProps = {
  params: GridRenderCellParams<Product>;
  allProducts: Product[];
  availableProducts: Product[];
};

const ProductSelectCellAction = ({
  params,
  allProducts,
  availableProducts
}: ProductSelectCellActionProps) => {
  const { id: gridId, field, value } = params;
  const apiRef = useGridApiContext();

  const handleChange = (e: SelectChangeEvent<number>) => {
    apiRef.current.setEditCellValue({
      id: gridId,
      field,
      value: allProducts.find((pdt) => pdt.id === e.target.value)
    });
  };

  const displayedLocations = value
    ? unionWith(availableProducts, [value], (a, b) => a.id === b.id)
    : availableProducts;

  return (
    <FormControl fullWidth sx={{ p: '0.5em' }}>
      <Select
        id='location-select'
        value={value?.id}
        renderValue={(value) =>
          allProducts.find((pdt) => pdt.id === value)?.name
        }
        size='small'
        onChange={handleChange}
      >
        {displayedLocations.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {product.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProductSelectCellAction;
