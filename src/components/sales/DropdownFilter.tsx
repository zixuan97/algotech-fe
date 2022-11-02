import { FilterList } from '@mui/icons-material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import _ from 'lodash';

interface filterProps {
  options: string[];
  handleFilterValueChange: (obj: any) => void;
  filterString: string;
  labelText: string;
}

const DropdownFilter = ({ options, handleFilterValueChange, filterString, labelText }: filterProps) => {
  return (
    <>
      <FilterList />
      <FormControl style={{ width: '50%' }}>
        <InputLabel>{labelText}</InputLabel>
        <Select
          value={filterString}
          label={labelText}
          placeholder={labelText}
          onChange={handleFilterValueChange}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {_.startCase(option.toLowerCase())}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default DropdownFilter;
