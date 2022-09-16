import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import { Location } from 'src/models/types';

type LocationSelectCellActionProps = {
  params: GridRenderCellParams<number>;
  allLocations: Location[];
  availableLocations: Location[];
};

const LocationSelectCellAction = ({
  params,
  allLocations,
  availableLocations
}: LocationSelectCellActionProps) => {
  const { id: gridId, field, value } = params;
  const apiRef = useGridApiContext();

  const handleChange = (e: SelectChangeEvent<number>) => {
    apiRef.current.setEditCellValue({
      id: gridId,
      field,
      value: e.target.value
    });
  };

  return (
    <FormControl fullWidth sx={{ p: '0.5em' }}>
      <Select
        id='location-select'
        value={value}
        renderValue={(value) =>
          allLocations.find((loc) => loc.id === value)?.name
        }
        size='small'
        onChange={handleChange}
      >
        {availableLocations.map((location) => (
          <MenuItem key={location.id} value={location.id}>
            {location.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LocationSelectCellAction;
