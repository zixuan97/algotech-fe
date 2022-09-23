import { Card, Divider } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { PlatformType } from 'src/models/types';

type PlatformData = {
  platform: PlatformType;
  orders: number;
};

const platformData = [
  {
    platform: PlatformType.SHOPEE,
    orders: 1000
  },
  {
    platform: PlatformType.LAZADA,
    orders: 5000
  },
  {
    platform: PlatformType.REDMART,
    orders: 2000
  },
  {
    platform: PlatformType.SHOPIFY,
    orders: 3500
  },
  {
    platform: PlatformType.OTHERS,
    orders: 10000
  }
];

const labels = [
  PlatformType.SHOPEE,
  PlatformType.LAZADA,
  PlatformType.REDMART,
  PlatformType.SHOPIFY,
  PlatformType.OTHERS
];

const colors = ['#FFB46F', '#9BBFE0', '#F49A93', '#C6D68F', '#D9D9D9'];

const options = {
  plugins: {
    legend: {
      labels: {
        font: { size: 12 }
      }
    }
  }
};

const arrangeOrderDataByPlatform = (platformData: PlatformData[]): number[] => {
  const map = new Map<PlatformType, number>();
  platformData.forEach((data) => {
    const { platform, orders } = data;
    map.set(platform, orders);
  });
  return labels.map((lbl) => map.get(lbl) ?? 0);
};

const PlatformPieChart = () => {
  const data = {
    labels: labels.map(
      (lbl) => lbl.charAt(0).toUpperCase() + lbl.slice(1).toLowerCase()
    ),
    datasets: [
      {
        label: 'Sales by Platform',
        data: arrangeOrderDataByPlatform(platformData),
        backgroundColor: colors,
        hoverOffset: 10
      }
    ]
  };
  return (
    <Card style={{ padding: '0.5em 2em 2em', height: '48vh' }}>
      <h3>Sales by Platform</h3>
      <Divider className='full-divider' sx={{ mb: 3 }} />
      <Doughnut data={data} options={options} />
    </Card>
  );
};

export default PlatformPieChart;
