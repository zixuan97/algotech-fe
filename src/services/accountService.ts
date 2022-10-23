/**
 * Used to make all API calls to authentication services
 */
import axios from 'axios';
import { User } from 'src/models/types';
import { NewUserType } from '../pages/account/CreateNewUser';
import apiRoot from './util/apiRoot';


export const getAllUserSvc = async (): Promise<Array<User>> => {
  return axios.get(`${apiRoot}/user/all`).then((res) => res.data);
};

export const getAllNonB2BUserSvc = async (): Promise<Array<User>> => {
  return axios.get(`${apiRoot}/user/nonb2b/all`).then((res) => res.data);
};

export const getUserDetailsSvc = async (userId: string): Promise<User> => {
  return axios.get(`${apiRoot}/user/details/${userId}`).then((res) => res.data);
};

export const disableUserSvc = async (userId: string): Promise<any> => {
  return axios.put(`${apiRoot}/user/disable/${userId}`).then((res) => res.data);
};

export const enableUserSvc = async (userId: string): Promise<any> => {
  return axios.put(`${apiRoot}/user/enable/${userId}`).then((res) => res.data);
};

export const createUserSvc = async (user: NewUserType): Promise<any> => {
  return axios.post(`${apiRoot}/user`, user).then((res) => res.data);
};

export const editUserSvc = async (user: User): Promise<any> => {
  return axios.put(`${apiRoot}/user`, user).then((res) => res.data);
};

export const deleteUserSvc = async (userId: string): Promise<any> => {
  return axios.delete(`${apiRoot}/user/${userId}`).then((res) => res.data);
};

export const forgetPasswordSvc = async (recipientEmail: string): Promise<any> => {
  return axios
    .post(`${apiRoot}/user/forgetpw`, { recipientEmail })
    .then((res) => res.data);
};

export const updatePasswordSvc = async (userEmail: string, currentPassword: string, newPassword: string): Promise<any> => {
  return axios
    .post(`${apiRoot}/user/updatepw`, {userEmail, currentPassword, newPassword})
    .then((res) => res.data);
};

export const getNumOfUsersSvc = async (): Promise<number> => {
  return axios.get(`${apiRoot}/user/pending/count`).then((res) => res.data);
};


//-----B2B-----
export const getAllB2BRequests = async (): Promise<Array<User>> => {
  return axios.get(`${apiRoot}/user/b2b/all`).then((res) => res.data);
};

export const getallPendingB2BRequests = async (): Promise<Array<User>> => {
  return axios.get(`${apiRoot}/user/b2b/pending`).then((res) => res.data);
};

export const rejectUserReqSvc = async (userId: string): Promise<any> => {
  return axios.put(`${apiRoot}/user/reject/${userId}`).then((res) => res.data);
};

export const approveUserReqSvc = async (userId: string): Promise<any> => {
  return axios.put(`${apiRoot}/user/approve/${userId}`).then((res) => res.data);
};
