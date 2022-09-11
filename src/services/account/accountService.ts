/**
 * Used to make all API calls to authentication services
 */
import axios from 'axios';
import { User } from 'src/models/types';
import apiRoot from '../util/apiRoot';

export const getAllUserSvc = (): Promise<Array<User>> => {
  return axios.get(`${apiRoot}/user/all`).then((res) => res.data);
};

export const getUserDetailsSvc = (userId: string): Promise<User> => {
  return axios.get(`${apiRoot}/user/details/${userId}`).then((res) => res.data);
};

export const disableUserSvc = (userId: string): Promise<any> => {
  return axios.put(`${apiRoot}/user/disable/${userId}`).then((res) => res.data);
};

export const enableUserSvc = (userId: string): Promise<any> => {
  return axios.put(`${apiRoot}/user/enable/${userId}`).then((res) => res.data);
};

export const createUserSvc = (user: User): Promise<any> => {
  return axios.post(`${apiRoot}/user`, user).then((res) => res.data);
};
