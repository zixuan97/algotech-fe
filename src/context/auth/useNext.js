import { useEffect, useRef } from 'react';

//[TODO] DANIEL: Update to TS if needed, this hook is used to ensure that state is updated before next action
function useNext(value) {
  const valueRef = useRef(value);
  const resolvesRef = useRef([]);
  useEffect(() => {
    if (valueRef.current !== value) {
      for (const resolve of resolvesRef.current) {
        resolve(value);
      }
      resolvesRef.current = [];
      valueRef.current = value;
    }
  }, [value]);
  return () =>
    new Promise((resolve) => {
      resolvesRef.current.push(resolve);
    });
}

export default useNext;
