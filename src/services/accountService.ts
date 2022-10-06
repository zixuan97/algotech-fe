/**
 * Used to make all API calls to authentication services
 */
import axios from 'axios';
import { User } from 'src/models/types';
import { NewUserType } from '../pages/account/CreateNewUser';
import apiRoot from './util/apiRoot';

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

export const createUserSvc = (user: NewUserType): Promise<any> => {
  return axios.post(`${apiRoot}/user`, user).then((res) => res.data);
};

export const editUserSvc = (user: User): Promise<any> => {
  return axios.put(`${apiRoot}/user`, user).then((res) => res.data);
};

export const deleteUserSvc = (userId: string): Promise<any> => {
  return axios.delete(`${apiRoot}/user/${userId}`).then((res) => res.data);
};

export const forgetPasswordSvc = (recipientEmail: string): Promise<any> => {
  return axios
    .post(`${apiRoot}/user/forgetpw`, { recipientEmail })
    .then((res) => res.data);
};

export const updatePasswordSvc = (userEmail: string, currentPassword: string, newPassword: string): Promise<any> => {
  return axios
    .post(`${apiRoot}/user/updatepw`, {userEmail, currentPassword, newPassword })
    .then((res) => res.data);
};

//-----B2B-----
export const getAllB2BRequests = (): Promise<Array<User>> => {
  return axios.get(`${apiRoot}/user/b2b/all`).then((res) => res.data);
};

export const getallPendingB2BRequests = (): Promise<Array<User>> => {
  return axios.get(`${apiRoot}/user/b2b/pending`).then((res) => res.data);
};

export const rejectUserReqSvc = (userId: string): Promise<any> => {
  return axios.put(`${apiRoot}/user/reject/${userId}`).then((res) => res.data);
};

export const approveUserReqSvc = (userId: string): Promise<any> => {
  return axios.put(`${apiRoot}/user/approve/${userId}`).then((res) => res.data);
};
