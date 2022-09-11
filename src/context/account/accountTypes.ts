import { User } from 'src/models/types';

export type AccountStateAttr = {
  user: User | null;
  error: string | null;
};

export type AccountStateInit = AccountStateAttr & {
  getUserDetails: (userId: string) => Promise<void>;
  clearErrors: () => void;
};

export type AccountAction = {
    type: AccountActionTypes;
    payload?: any;
  };

export enum AccountActionTypes {
  USER_LOADED = 'USER_LOADED',
  LOAD_ERROR = 'LOAD_ERROR',
  DISABLE_USER = 'DISABLE_USER',
  DELETE_USER = 'DELETE_USER',
  CLEAR_ERRORS = 'CLEAR_ERRORS'
}
