import { createContext } from 'react';
import { AuthStateInit } from './authTypes';

// TODO: externalise initial state to an object
const authContext = createContext({
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  error: null
} as AuthStateInit);

export default authContext;
