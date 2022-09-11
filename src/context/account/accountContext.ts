import { createContext } from 'react';
import { AccountStateInit } from './accountTypes';

// TODO: externalise initial state to an object
const accountContext = createContext({
  user: null,
  error: null
} as AccountStateInit);

export default accountContext;
