import { Card, Divider, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { PlatformType, SalesOrder } from 'src/models/types';
import { Chart as ChartJS, ChartTypeRegistry, TooltipItem } from 'chart.js';
import { OrderedMap } from 'immutable';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { startCase } from 'lodash';

ChartJS.register(ChartDataLabels);

const labels = [
  PlatformType.SHOPEE,
  PlatformType.LAZADA,
  PlatformType.REDMART,
  PlatformType.SHOPIFY,
  PlatformType.OTHERS,
  PlatformType.B2B
];

const colors = [
  '#FFB46F',
  '#9BBFE0',
  '#F49A93',
  '#C6D68F',
  '#D9D9D9',
  '#CDCDFF'
];

const options = {
  plugins: {
    legend: {
      labels: {
        font: { size: 12 }
      }
    },
    datalabels: {
      formatter: (value: number) => (value > 0 ? value.toLocaleString() : '')
    },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<keyof ChartTypeRegistry>) => {
          const totalQty = (context.dataset.data as number[]).reduce(
            (a, b) => a + b,
            0
          );
          const percentage = `${((context.parsed / totalQty) * 100).toFixed(
            2
          )}%`;

          console.log(context);
          return `${context.label}: ${context.formattedValue} (${percentage})`;
        }
      }
    }
  }
};

const getOrderDataByPlatform = (salesOrders: SalesOrder[]): number[] => {
  // OrderedMap is immutable
  let map = OrderedMap<PlatformType, number>(labels.map((lbl) => [lbl, 0]));
  salesOrders.forEach((salesOrder) => {
    map = map.set(
      salesOrder.platformType,
      map.get(salesOrder.platformType, 0) + 1
    );
  });
  return [...map.values()];
};

type PlatformPieChartProps = {
  salesOrders: SalesOrder[];
};

const PlatformPieChart = ({ salesOrders }: PlatformPieChartProps) => {
  // TODO: change to API call once implemented
  const data = {
    labels: labels.map((lbl) => startCase(lbl.toLowerCase())),
    datasets: [
      {
        label: 'Sales by Platform',
        data: getOrderDataByPlatform(salesOrders),
        backgroundColor: colors,
        hoverOffset: 10
      }
    ]
  };
  return (
    <Card style={{ padding: '0.5em 2em 2em', height: '48vh' }}>
      <h3>Sales by Platform</h3>
      <Divider className='full-divider' sx={{ mb: 3 }} />
      {salesOrders.length ? (
        <Doughnut data={data} options={options} />
      ) : (
        <Typography sx={{ fontSize: '0.8em', opacity: 0.8 }}>
          No orders placed within current time range.
        </Typography>
      )}
    </Card>
  );
};

export default PlatformPieChart;
