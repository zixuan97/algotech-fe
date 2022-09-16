import { AxiosError } from 'axios';

const asyncFetchCallback = async <T>(
  res: Promise<T>,
  successCallback: (value: T) => void,
  errorCallback?: (err: AxiosError) => void
) => {
  if (errorCallback) {
    res.then(successCallback).catch((err: AxiosError) => errorCallback(err));
  } else {
    res.then(successCallback);
  }
};

export default asyncFetchCallback;
