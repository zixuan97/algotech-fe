/**
 * Used to make all API calls to location-related services
 */
import axios from 'axios';
import { Location } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllLocations = async (): Promise<Location[]> => {
  return axios.get(`${apiRoot}/location/all`).then((res) => res.data);
};  

export const getLocationById = async (
  id: string | number
): Promise<Location> => {
  return axios.get(`${apiRoot}/location/${id}`).then((res) => res.data);
};

export const create = async (location: Location): Promise<void> => {
  return axios.post(`${apiRoot}/location`, location);
}

export const updateLocation = async (location: Location): Promise<void> => {
  return axios.put(`${apiRoot}/location`, location);
};

export const deleteLocation = async (id: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/location/${id}`);
};