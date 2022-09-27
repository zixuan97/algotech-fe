import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import { unionWith } from 'lodash';
import { Product, BundleProduct } from 'src/models/types';

type ProductSelectCellActionProps = {
  params: GridRenderCellParams<BundleProduct>;
  allProducts: Product[];
  availableProducts: BundleProduct[];
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
      value: { product: allProducts.find((pdt) => pdt.id === e.target.value), productId: e.target.value } ,
      // name: allProducts.find((pdt) => pdt.id === e.target.value)?.name,
      //this is the issue rn
    });
  };

  const displayedProducts = value
    ? unionWith(availableProducts, [value], (a, b) => a.productId === b.productId)
    : availableProducts;

  console.log("display_product", displayedProducts);

  return (
    <FormControl fullWidth sx={{ p: '0.5em' }}>
      <Select
        id='location-select'
        name="select-option"
        value={value?.productId}
        renderValue={(value) => {
          console.log("render_value",value);
          console.log("all_pdts", allProducts);
          return allProducts.find((pdt) => pdt.id === value)?.name
        }
          
        }
        size='small'
        onChange={handleChange}
      >
        {displayedProducts.map((bundleProduct) => (
          <MenuItem key={bundleProduct.productId} value={bundleProduct.productId}>
            {bundleProduct?.product?.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProductSelectCellAction;
