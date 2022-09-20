import { createContext } from 'react';
import { AuthStateInit } from './authContextTypes';

// TODO: externalise initial state to an object
const authContext = createContext({} as AuthStateInit);

export default authContext;
