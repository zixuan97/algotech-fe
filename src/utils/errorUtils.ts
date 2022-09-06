import { AxiosError } from 'axios';

export const getAxiosErrorMsg = (e: unknown): string => {
  if (e instanceof AxiosError) return e.response?.data;
  return String(e);
};

export const getErrorMsg = (e: unknown): string => {
  if (e instanceof Error) return e.message;
  return String(e);
};
