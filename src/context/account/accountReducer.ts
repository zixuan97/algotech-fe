import { Reducer } from 'react';
import { AccountStateAttr, AccountAction, AccountActionTypes } from './accountTypes';

const accountReducer: Reducer<AccountStateAttr, AccountAction> = (
  state: AccountStateAttr,
  action: AccountAction
): AccountStateAttr => {
  switch (action.type) {
    case AccountActionTypes.USER_LOADED:
      return {
        ...state,
        user: action.payload
      };
    case AccountActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export default accountReducer;
