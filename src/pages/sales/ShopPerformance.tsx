import { Divider, Tab, Tabs } from '@mui/material';
import React from 'react';
import LazadaPerformanceDashboard from 'src/components/sales/performance/LazadaPerformanceDashboard';
import ShopeePerformanceDashboard from 'src/components/sales/performance/ShopeePerformanceDashboard';
import { PlatformType } from 'src/models/types';
import {
  getLazadaPerformance,
  getShopeePerformance,
  LazadaPerformance,
  ShopeePerformance
} from 'src/services/shopPerformanceService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import '../../styles/common/common.scss';

const ShopPerformance = () => {
  const [shopeePerformance, setShopeePerformance] =
    React.useState<ShopeePerformance | null>(null);
  const [lazadaPerformance, setLazadaPerformance] =
    React.useState<LazadaPerformance | null>(null);
  const [currentShop, setCurrentShop] = React.useState<PlatformType>(
    PlatformType.SHOPEE
  );

  const PerformanceDashboard = () => {
    switch (currentShop) {
      case PlatformType.SHOPEE:
        return (
          <ShopeePerformanceDashboard shopeePerformance={shopeePerformance} />
        );
      case PlatformType.LAZADA:
        return (
          <LazadaPerformanceDashboard lazadaPerformance={lazadaPerformance} />
        );
      default:
        return null;
    }
  };

  React.useEffect(() => {
    asyncFetchCallback(getShopeePerformance(), setShopeePerformance);
    asyncFetchCallback(getLazadaPerformance(), setLazadaPerformance);
  }, []);
  return (
    <div className='container-left-padding'>
      <h1>Shop Performance</h1>
      <Tabs value={currentShop} onChange={(e, value) => setCurrentShop(value)}>
        <Tab label='Shopee' value={PlatformType.SHOPEE} />
        <Tab label='Lazada' value={PlatformType.LAZADA} />
      </Tabs>
      <Divider sx={{ width: '100%', mb: 3 }} />
      <PerformanceDashboard />
    </div>
  );
};

export default ShopPerformance;
