import { Chart as ChartJS, registerables } from 'chart.js';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Product, StockQuantity } from 'src/models/types';
import { interpolateColors } from 'src/utils/chartUtils';
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

const InventoryLevelsChart = React.forwardRef<
  HTMLDivElement,
  InventoryTurnoverChartProps
>((props: InventoryTurnoverChartProps, ref) => {
  const { productData } = props;
  const labels = React.useMemo(
    () => productData.map((product) => product.name),
    [productData]
  );
  const CHART_COLORS = interpolateColors(
    productData.length,
    interpolateRdYlBu,
    {
      colorStart: 0.1,
      colorEnd: 1,
      useEndAsStart: false
    }
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
        backgroundColor: CHART_COLORS
      }
    ]
  };

  return (
    <div className='container-center' style={{ width: '100%' }} ref={ref}>
      <Bar data={data} options={options} />
    </div>
  );
});

export default InventoryLevelsChart;
