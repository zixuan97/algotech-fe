import { Reducer } from 'react';
import {
  InventoryAction,
  InventoryActionTypes,
  InventoryStateAttr
} from './inventoryContextTypes';

const inventoryReducer: Reducer<InventoryStateAttr, InventoryAction> = (
  state: InventoryStateAttr,
  action: InventoryAction
): InventoryStateAttr => {
  switch (action.type) {
    case InventoryActionTypes.UPDATE_PRODUCTS:
      return {
        ...state,
        products: action.payload
      };
    case InventoryActionTypes.UPDATE_BRANDS:
      return {
        ...state,
        brands: action.payload
      };
    case InventoryActionTypes.UPDATE_LOCATIONS:
      return {
        ...state,
        locations: action.payload
      };
    case InventoryActionTypes.UPDATE_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
    default:
      return state;
  }
};

export default inventoryReducer;
