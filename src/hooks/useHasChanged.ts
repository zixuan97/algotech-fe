import { isEqual } from 'lodash';
import usePrevious from './usePrevious';

const useHasChanged = <T>(value: T) => {
  const prev = usePrevious(value);

  return !isEqual(prev, value);
};

export default useHasChanged;
