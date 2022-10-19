import { Card, Divider } from '@mui/material';
import {
  Chart as ChartJS,
  ChartTypeRegistry,
  registerables,
  TooltipItem
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import { CustomerOrderValue } from 'src/models/types';
import { READABLE_MMYYYY } from 'src/utils/dateUtils';

ChartJS.register(...registerables);

type OrderAmountProps = {
  values: CustomerOrderValue[];
};

const OrderAmountChart = ({ values }: OrderAmountProps) => {
  const data = {
    labels: values.map((rev) => moment(rev.month).format(READABLE_MMYYYY)),
    datasets: [
      {
        data: values.map((rev) => rev.totalamount),
        barPercentage: 0.5,
        borderRadius: 5,
        backgroundColor: '#DAD7FE'
      }
    ]
  };
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
      // ticks: {
      //   // Include a dollar sign in the ticks
      //   callback: function (value: string) {
      //     return '$' + value;
      //   }
      // }
    },
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<keyof ChartTypeRegistry>) => {
            const amount = `Total Amount : $ ${context.formattedValue}`;
            const num = `Number of Orders: ${
              values[context.dataIndex].numorders
            }`;
            const concat = amount + '   ' + num;
            return concat;
          }
        }
      }
    }
  };
  return (
    <Card style={{ padding: '0.5em 2em 2em', height: 'auto' }}>
      <h3>Order Amount</h3>
      <Divider className='full-divider' />
      <Bar data={data} options={options} />
    </Card>
  );
};

export default OrderAmountChart;
