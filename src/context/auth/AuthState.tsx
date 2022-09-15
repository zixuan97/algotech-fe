import React, { useReducer } from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import { AuthActionTypes, AuthStateAttr } from './authTypes';
import { PropsWithChildren } from 'react';
import { getAxiosErrorMsg } from 'src/utils/errorUtils';
import {
  getUserSvc,
  getWebTokenSvc,
  UserInput
} from 'src/services/authService';
import useNext from 'src/hooks/useNext';
import { User } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { setAuthToken } from 'src/utils/authUtils';

const AuthState = (props: PropsWithChildren) => {
  const initialState: AuthStateAttr = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);
  const nextState = useNext(state);

  React.useEffect(() => {
    if (initialState.token) {
      loadUser();
    }
  }, [initialState.token]);

  // load user - check which user is logged in and get user data
  const loadUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
    asyncFetchCallback(
      getUserSvc(),
      (user: User) =>
        dispatch({
          type: AuthActionTypes.USER_LOADED,
          // res.data is the actual user data
          payload: user
        }),
      () => dispatch({ type: AuthActionTypes.AUTH_ERROR })
    );
  };

  // login user
  const login = async (userInput: UserInput) =>
    asyncFetchCallback(
      getWebTokenSvc(userInput),
      async (token: string) => {
        dispatch({
          type: AuthActionTypes.LOGIN_SUCCESS,
          payload: token
        });
        await nextState();
        loadUser();
      },
      (e: Error) =>
        dispatch({
          type: AuthActionTypes.LOGIN_FAIL,
          payload: getAxiosErrorMsg(e)
        })
    );

  // logout - destroy the token
  const logout = () => dispatch({ type: AuthActionTypes.LOGOUT });

  // clear errors
  const clearErrors = () => dispatch({ type: AuthActionTypes.CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        error: state.error,
        loadUser,
        login,
        logout,
        clearErrors
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
