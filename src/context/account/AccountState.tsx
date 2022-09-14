import React, { useReducer } from 'react';
import AccountContext from './accountContext';
import accountReducer from './accountReducer';
import { AccountActionTypes, AccountStateAttr } from './accountTypes';
import { PropsWithChildren } from 'react';
import { getAxiosErrorMsg } from 'src/utils/errorUtils';
import { getUserDetailsSvc } from 'src/services/accountService';
import useNext from 'src/hooks/useNext';
import { User } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';

const AccountState = (props: PropsWithChildren) => {
  const initialState: AccountStateAttr = {
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(accountReducer, initialState);

  // get user details - get user details from db
  const getUserDetails = async (userId: string) =>
    asyncFetchCallback(
      getUserDetailsSvc(userId),
      (user: User) =>
        dispatch({
          type: AccountActionTypes.USER_LOADED,
          // res.data is the actual user data
          payload: user
        }),
      () => dispatch({ type: AccountActionTypes.LOAD_ERROR })
    );

  // clear errors
  const clearErrors = () => dispatch({ type: AccountActionTypes.CLEAR_ERRORS });

  return (
    <AccountContext.Provider
      value={{
        user: state.user,
        error: state.error,
        getUserDetails,
        clearErrors
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountState;
