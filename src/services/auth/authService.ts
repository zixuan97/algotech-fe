/**
 * Used to make all API calls to authentication services
 */
import axios from 'axios';
import { User } from 'src/models/types';
import apiRoot from '../apiRoot';

export interface UserInput {
  email: string;
  password: string;
}

export const getWebTokenSvc = async (userInput: UserInput): Promise<string> => {
  return axios
    .post(`${apiRoot}/user/auth`, userInput, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.data);
};

export const getUserSvc = (): Promise<User> => {
  return axios
    .get(`${apiRoot}/user`, { withCredentials: true })
    .then((res) => res.data);
};
