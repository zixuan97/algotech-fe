import { Card, Divider } from '@mui/material';
import { Chart as ChartJS, registerables } from 'chart.js';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { interpolateColors } from 'src/utils/chartUtils';
import { READABLE_DDMMYY } from 'src/utils/dateUtils';

ChartJS.register(...registerables);

const revenueData = [
  {
    date: moment().subtract(4, 'days'),
    revenue: 10000
  },
  {
    date: moment().subtract(3, 'days'),
    revenue: 20000
  },
  {
    date: moment().subtract(2, 'days'),
    revenue: 30000
  },
  {
    date: moment().subtract(1, 'days'),
    revenue: 50000
  },
  {
    date: moment(),
    revenue: 25000
  }
];

const options = {
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true
    }
  }
};

const CHART_COLORS = interpolateColors(revenueData.length, interpolateRdYlBu, {
  colorStart: 0.1,
  colorEnd: 1,
  useEndAsStart: false
});

const RevenueChart = () => {
  const data = {
    labels: revenueData.map((rev) => rev.date.format(READABLE_DDMMYY)),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map((rev) => rev.revenue),
        barPercentage: 0.5,
        borderRadius: 5,
        backgroundColor: '#DAD7FE'
      }
    ]
  };
  return (
    <Card style={{ padding: '0.5em 2em 2em', height: '48vh' }}>
      <h3>Revenue</h3>
      <Divider className='full-divider' />
      <Bar data={data} options={options} />
    </Card>
  );
};

export default RevenueChart;
