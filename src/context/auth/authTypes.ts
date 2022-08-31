import { User } from 'src/models/types';
import { UserInput } from 'src/pages/Login';

export type AuthStateAttr = {
    token: string | null;
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
};

export type AuthStateInit = AuthStateAttr & {
    loadUser: () => Promise<void>;
    login: (userInput: UserInput) => Promise<void>;
    logout: () => void;
    clearErrors: () => void;
};

export type AuthAction = {
    type: AuthActionTypes;
    payload?: any;
};

export enum AuthActionTypes {
    USER_LOADED = 'USER_LOADED',
    AUTH_ERROR = 'AUTH_ERROR',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAIL = 'LOGIN_FAIL',
    LOGOUT = 'LOGOUT',
    CLEAR_ERRORS = 'CLEAR_ERRORS'
}
