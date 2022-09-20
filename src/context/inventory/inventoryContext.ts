import { createContext } from 'react';
import { InventoryStateInit } from './inventoryContextTypes';

const inventoryContext = createContext({} as InventoryStateInit);

export default inventoryContext;
