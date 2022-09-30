import axios from 'axios';
import apiRoot from './util/apiRoot';

// interfaces for shopee performance
export interface ShopeePerformance {
  overallPerformance: 1 | 2 | 3 | 4;
  listingViolations: ShopeePerformanceCategory;
  fulfilment: ShopeePerformanceCategory;
  customerService: ShopeePerformanceCategory;
  customerSatisfaction: ShopeePerformanceCategory;
}

export interface ShopeePerformanceCategory {
  [metric: string]: PerformanceData;
}

export interface PerformanceData {
  [dataType: string]: ShopeePerformanceData;
}

export interface ShopeePerformanceData {
  target: string;
  my_shop_performance: string;
  penalty_points: string;
}

export const SHOPEE_OVERALL_PERFORMANCE = {
  1: 'Excellent',
  2: 'Good',
  3: 'Needs Improvement',
  4: 'Poor'
};

// interfaces for lazada performance
export interface LazadaPerformance {
  indicators: LazadaIndicators[];
  category: string;
  sellerId: number;
}

export interface LazadaIndicators {
  action_url: string;
  score?: number;
  score_format: LazadaScoreFormat;
  formatted_score: string;
  name: string;
  tip: string;
  type: string;
  formatted_target: string;
  target: number;
  target_format: string;
  target_respected: boolean;
}

export enum LazadaScoreFormat {
  PERCENTAGE = 'PERCENTAGE',
  MINUTES = 'MINUTES',
  DOUBLE = 'DOUBLE',
  INTEGER = 'INTEGER'
}

export const getShopeePerformance = async (): Promise<ShopeePerformance> => {
  return axios.get(`${apiRoot}/shopee/performance`).then((res) => res.data);
};

export const getLazadaPerformance = async (): Promise<LazadaPerformance> => {
  return axios.get(`${apiRoot}/lazada/performance`).then((res) => res.data);
};
