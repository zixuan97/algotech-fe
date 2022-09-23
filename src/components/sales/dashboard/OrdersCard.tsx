import { MoreVert } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { READABLE_DDMM } from 'src/utils/dateUtils';
import NumberCard from '../../common/NumberCard';

const orderData = [
  {
    date: moment().subtract(4, 'days'),
    ordersReceived: 1000
  },
  {
    date: moment().subtract(3, 'days'),
    ordersReceived: 2400
  },
  {
    date: moment().subtract(2, 'days'),
    ordersReceived: 3000
  },
  {
    date: moment().subtract(1, 'days'),
    ordersReceived: 2134
  },
  {
    date: moment(),
    ordersReceived: 4312
  }
];

const options = {
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

const OrdersCard = () => {
  const data = {
    labels: orderData.map((order) => order.date.format(READABLE_DDMM)),
    datasets: [
      {
        label: 'Revenue',
        data: orderData.map((order) => order.ordersReceived),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const ordersReceived = orderData.reduce(
    (prev, curr) => prev + curr.ordersReceived,
    0
  );

  return (
    <NumberCard
      value={ordersReceived}
      text='Orders received in total'
      component={
        <>
          <div style={{ paddingTop: '2em' }}>
            <Line
              data={data}
              options={options}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <IconButton>
            <MoreVert />
          </IconButton>
        </>
      }
    />
  );
};

export default OrdersCard;
