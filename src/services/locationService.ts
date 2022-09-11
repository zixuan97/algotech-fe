/**
 * Used to make all API calls to location-related services
 */
import axios from 'axios';
import { Location } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getLocationById = async (
  id: string | number
): Promise<Location> => {
  return axios.get(`${apiRoot}/location/${id}`).then((res) => res.data);
};
