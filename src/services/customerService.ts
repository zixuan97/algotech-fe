/**
 * Used to make all API calls to customer-related services
 */
import axios from 'axios';
import {
  Customer,
  JobStatus,
  NewsletterTemplate,
  ScheduledNewsletter
} from 'src/models/types';
import { MomentRange } from 'src/utils/dateUtils';
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

export const createNewsletterTemplate = async (body: object): Promise<void> => {
  return axios.post(`${apiRoot}/newsletter`, body);
};

export const filterAndGetCustomers = async (
  body: object
): Promise<Customer[]> => {
  return axios
    .post(`${apiRoot}/customer/filter`, body)
    .then((res) => res.data.customers);
};

export const scheduleNewsletter = async (body: object): Promise<void> => {
  return axios.post(`${apiRoot}/newsletter/schedule`, body);
};

export const getScheduledNewslettersByDateRange = (
  dateRange: MomentRange,
  jobStatus: JobStatus
): Promise<ScheduledNewsletter[]> => {
  const reqBody = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format(),
    jobStatus: jobStatus
  };
  return axios
    .post(`${apiRoot}/newsletter/schedule/jobStatus`, reqBody)
    .then((res) => res.data);
};

export const getScheduledNewsletterById = async (
  id: string | number
): Promise<ScheduledNewsletter> => {
  return axios
    .get(`${apiRoot}/newsletter/schedule/${id}`)
    .then((res) => res.data);
};

export const editScheduledNewsletter = async (body: object): Promise<void> => {
  return axios.put(`${apiRoot}/newsletter/schedule`, body);
};

export const cancelScheduledNewsletter = async (
  body: object
): Promise<void> => {
  return axios.put(`${apiRoot}/newsletter/schedule/cancel`, body);
};
