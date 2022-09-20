import React, { PropsWithChildren } from 'react';
import { getAllBrands } from 'src/services/brandService';
import { getAllProductCategories } from 'src/services/categoryService';
import { getAllLocations } from 'src/services/locationService';
import { getAllProducts } from 'src/services/productService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  InventoryActionTypes,
  InventoryStateAttr
} from './inventoryContextTypes';
import InventoryContext from './inventoryContext';
import inventoryReducer from './inventoryReducer';

const InventoryState = (props: PropsWithChildren) => {
  const initialState: InventoryStateAttr = {
    products: [],
    brands: [],
    locations: [],
    categories: []
  };

  const [state, dispatch] = React.useReducer(inventoryReducer, initialState);

  // load all by default
  React.useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchLocations();
    fetchCategories();
  }, []);

  const fetchProducts = () =>
    asyncFetchCallback(getAllProducts(), (res) =>
      dispatch({ type: InventoryActionTypes.UPDATE_PRODUCTS, payload: res })
    );

  const fetchBrands = () =>
    asyncFetchCallback(getAllBrands(), (res) =>
      dispatch({ type: InventoryActionTypes.UPDATE_BRANDS, payload: res })
    );

  const fetchLocations = () =>
    asyncFetchCallback(getAllLocations(), (res) =>
      dispatch({ type: InventoryActionTypes.UPDATE_LOCATIONS, payload: res })
    );

  const fetchCategories = () =>
    asyncFetchCallback(getAllProductCategories(), (res) =>
      dispatch({ type: InventoryActionTypes.UPDATE_CATEGORIES, payload: res })
    );

  return (
    <InventoryContext.Provider
      value={{
        ...state,
        refreshProducts: fetchProducts,
        refreshBrands: fetchBrands,
        refreshLocations: fetchLocations,
        refreshCategories: fetchCategories
      }}
    >
      {props.children}
    </InventoryContext.Provider>
  );
};

export default InventoryState;
