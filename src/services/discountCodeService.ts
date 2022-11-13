/**
 * Used to make all API calls to authentication services
 */
import axios from 'axios';
import { DiscountCode } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllDiscountCodes = async (): Promise<Array<DiscountCode>> => {
  return axios.get(`${apiRoot}/discountCode/all`).then((res) => res.data);
};

export const createDiscountCodeSvc = async (discountCode: Partial<DiscountCode>): Promise<any> => {
  return axios.post(`${apiRoot}/discountCode`, discountCode).then((res) => res.data);
};

export const editDiscountCodeSvc = async (discountCode: DiscountCode): Promise<any> => {
  return axios.put(`${apiRoot}/discountCode`, discountCode).then((res) => res.data);
};

export const deleteDiscountCodeSvc = async (id: string): Promise<any> => {
  return axios.delete(`${apiRoot}/discountCode/${id}`).then((res) => res.data);
};

export const getDiscountCodeDetailsSvc = async (id: string): Promise<DiscountCode> => {
  return axios.get(`${apiRoot}/discountCode/id/${id}`).then((res) => res.data);
};