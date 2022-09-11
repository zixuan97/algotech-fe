import { Chart as ChartJS, registerables } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Product, StockQuantity } from 'src/models/types';
import '../../styles/common/common.scss';

ChartJS.register(...registerables);

type InventoryTurnoverChartProps = {
  productData: Product[];
};

const options = {
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grace: '20%'
    }
  }
};

const InventoryLevelsChart = ({ productData }: InventoryTurnoverChartProps) => {
  const labels = React.useMemo(
    () => productData.map((product) => product.name),
    [productData]
  );
  const chartData = React.useMemo(
    () =>
      productData.map((product) =>
        product.stockQuantity.reduce(
          (prev: number, curr: StockQuantity) => prev + curr.quantity,
          0
        )
      ),
    [productData]
  );
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Inventory Turnover',
        data: chartData,
        barPercentage: 0.6,
        borderRadius: 10,
        backgroundColor: '#DAD7FE'
      }
    ]
  };

  return (
    <div className='container-center' style={{ width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default InventoryLevelsChart;
