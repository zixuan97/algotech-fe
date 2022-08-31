import { Reducer } from 'react';
import { setAuthToken } from 'src/utils/authUtils';
import { AuthStateAttr, AuthAction, AuthActionTypes } from './authTypes';

const authReducer: Reducer<AuthStateAttr, AuthAction> = (
    state: AuthStateAttr,
    action: AuthAction
): AuthStateAttr => {
    switch (action.type) {
        case AuthActionTypes.USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload
            };
        case AuthActionTypes.LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            setAuthToken(action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case AuthActionTypes.AUTH_ERROR:
        case AuthActionTypes.LOGIN_FAIL:
        case AuthActionTypes.LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                error: action.payload
            };
        case AuthActionTypes.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

export default authReducer;
