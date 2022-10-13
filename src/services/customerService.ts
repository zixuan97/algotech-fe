/**
 * Used to make all API calls to customer-related services
 */
import axios from 'axios';
import { Customer, NewsletterTemplate } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllCustomers = async (): Promise<Customer[]> => {
  return axios.get(`${apiRoot}/customer/all`).then((res) => res.data);
};

export const getCustomerById = async (id: string | any): Promise<Customer> => {
  return axios.get(`${apiRoot}/customer/id/${id}`).then((res) => res.data);
};

export const getAllNewsletterTemplates = async (): Promise<
  NewsletterTemplate[]
> => {
  return axios.get(`${apiRoot}/newsletter/all`).then((res) => res.data);
};

export const getNewsletterTemplateById = async (
  id: string | number
): Promise<NewsletterTemplate> => {
  return axios.get(`${apiRoot}/newsletter/${id}`).then((res) => res.data);
};

export const editNewsletterTemplate = async (body: object): Promise<void> => {
  return axios.put(`${apiRoot}/newsletter`, body);
};

export const deleteNewsletterTemplate = async (
  id: string | number
): Promise<void> => {
  return axios.delete(`${apiRoot}/newsletter/${id}`);
};
