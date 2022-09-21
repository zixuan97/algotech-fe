import { createContext } from 'react';
import { SalesStateInit } from './salesContextTypes';

const salesContext = createContext({} as SalesStateInit);

export default salesContext;
