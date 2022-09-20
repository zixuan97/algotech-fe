import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import { unionWith } from 'lodash';
import { Location } from 'src/models/types';

type LocationSelectCellActionProps = {
  params: GridRenderCellParams<Location>;
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
      value: allLocations.find((loc) => loc.id === e.target.value)
    });
  };

  const displayedLocations = value
    ? unionWith(availableLocations, [value], (a, b) => a.id === b.id)
    : availableLocations;

  return (
    <FormControl fullWidth sx={{ p: '0.5em' }}>
      <Select
        id='location-select'
        value={value?.id}
        renderValue={(value) =>
          allLocations.find((loc) => loc.id === value)?.name
        }
        size='small'
        onChange={handleChange}
      >
        {displayedLocations.map((location) => (
          <MenuItem key={location.id} value={location.id}>
            {location.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LocationSelectCellAction;
