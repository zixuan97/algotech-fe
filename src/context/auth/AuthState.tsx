import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import { AuthActionTypes, AuthStateAttr } from './authTypes';
import { PropsWithChildren } from 'react';
import { getAxiosErrorMsg } from 'src/utils/errorUtils';
import { UserInput } from 'src/pages/Login';
import apiRoot from 'src/services/apiRoot';
import useNext from './useNext'



const AuthState = (props: PropsWithChildren) => {
    const initialState: AuthStateAttr = {
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        user: null,
        error: null
    };

    const [state, dispatch] = useReducer(authReducer, initialState);
    const nextState = useNext(state);
    // load user - check which user is logged in and get user data
    const loadUser = async () => {
        try {
            const res = await axios.get(`${apiRoot}/user`);

            dispatch({
                type: AuthActionTypes.USER_LOADED,
                // res.data is the actual user data
                payload: res.data
            });
        } catch (error) {
            dispatch({
                type: AuthActionTypes.AUTH_ERROR
            });
        }
    };

    // login user
    const login = async (userInput: UserInput) => {
        try {
            const res = await axios.post(`${apiRoot}/user/auth`, userInput, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            dispatch({
                type: AuthActionTypes.LOGIN_SUCCESS,
                payload: res.data
            })
            // added to await state changes before proceeding to next action
            await nextState();
            loadUser();
        } catch (e) {
            dispatch({
                type: AuthActionTypes.LOGIN_FAIL,
                payload: getAxiosErrorMsg(e)
            });
        }
    };

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
