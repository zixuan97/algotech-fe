/**
 * Used to make all API calls to location-related services
 */
import axios from 'axios';
import { Location, Product, StockQuantity } from 'src/models/types';
import { NewLocation } from 'src/pages/inventory/CreateWarehouse';
import apiRoot from './util/apiRoot';

export interface LocationUpdateType {
  id: number;
  name: string;
  address: string;
  products: Product[];
}

export interface LocationUpdateNoProductsType
  extends Omit<LocationUpdateType, 'products'> {}

export const getAllLocations = async (): Promise<Location[]> => {
  return axios.get(`${apiRoot}/location/all`).then((res) => res.data);
};

export const getLocationById = async (
  id: string | number
): Promise<Location> => {
  return axios.get(`${apiRoot}/location/${id}`).then((res) => res.data);
};

export const createLocation = async (location: NewLocation): Promise<void> => {
  return axios.post(`${apiRoot}/location`, location);
};

// export const updateLocation = async (location: Location): Promise<void> => {
//   return axios.put(`${apiRoot}/location`, location);
// };

export const updateLocation = async (
  location: LocationUpdateType
): Promise<void> => {
  return axios.put(`${apiRoot}/location`, location);
};

export const updateLocationWithoutProducts = async (
  location: LocationUpdateNoProductsType
) => {
  return axios.put(`${apiRoot}/location/noproduct`, location);
};

export const deleteLocation = async (id: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/location/${id}`);
};
