import { useEffect, useRef } from 'react';

//this hook is used to ensure that state is updated before next action
const useNext = <T>(value: T) => {
  const valueRef = useRef<T>(value);
  const resolvesRef = useRef<((value: T) => void)[]>([]);
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
};

export default useNext;
