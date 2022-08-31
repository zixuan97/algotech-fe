import { createContext } from 'react';
import { AuthStateInit } from './authTypes';

// TODO: externalise initial state to an object
const authContext = createContext({
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    user: null,
    error: null
} as AuthStateInit);

export default authContext;
