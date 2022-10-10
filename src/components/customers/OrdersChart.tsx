import { Card, Divider } from '@mui/material';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CustomerOrderValue } from 'src/models/types';

ChartJS.register(...registerables);

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
  },
  plugins: {
    legend: {
      display: false
    },
    datalabels: {
      display: false
    }
  }
};

type OrderAmountProps = {
  values: CustomerOrderValue[];
};

const OrderAmountChart = ({ values }: OrderAmountProps) => {
  const data = {
    labels: values.map((rev) =>
      rev.month
    ),
    datasets: [
      {
        label: 'Amount',
        data: values.map((rev) => rev.value),
        barPercentage: 0.5,
        borderRadius: 5,
        backgroundColor: '#DAD7FE'
      }
    ]
  };
  return (
    <Card style={{ padding: '0.5em 2em 2em', height: '48vh' }}>
      <h3>Order Amount</h3>
      <Divider className='full-divider' />
      <Bar data={data} options={options} />
    </Card>
  );
};

export default OrderAmountChart;