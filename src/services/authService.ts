/**
 * Used to make all API calls to authentication services
 */
import axios from 'axios';
import { User } from 'src/models/types';
import apiRoot from './util/apiRoot';

export interface UserInput {
  email: string;
  password: string;
}

export const getWebTokenSvc = async (userInput: UserInput): Promise<string> => {
  return axios
    .post(`${apiRoot}/user/auth`, userInput, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.data);
};

export const getUserSvc = async (): Promise<User> => {
  return axios.get(`${apiRoot}/user`).then((res) => res.data);
};
