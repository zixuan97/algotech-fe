const asyncFetchCallback = async <T>(
  res: Promise<T>,
  successCallback: (value: T) => void,
  errorCallback?: (err: Error) => void
) => {
  if (errorCallback) {
    res.then(successCallback).catch(errorCallback);
  } else {
    res.then(successCallback);
  }
};

export default asyncFetchCallback;
