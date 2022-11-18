import {
  Card,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import moment from 'moment';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { ProductSalesQty, SalesBestseller } from 'src/models/types';
import { getProductSalesByRangeSvc } from 'src/services/salesService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { MomentRange, READABLE_DDMM } from 'src/utils/dateUtils';

const options = {
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
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

type OrdersCardProps = {
  bestsellers: SalesBestseller[];
  dateRange: MomentRange;
};

const ProductSalesChart = ({ bestsellers, dateRange }: OrdersCardProps) => {
  const [productName, setProductName] = React.useState<string>('');
  const [productSalesQty, setProductSalesQty] = React.useState<
    ProductSalesQty[]
  >([]);

  const handleChange = (event: SelectChangeEvent) => {
    setProductName(event.target.value as string);
  };

  React.useEffect(() => {
    asyncFetchCallback(
      getProductSalesByRangeSvc(dateRange, productName),
      (res) => {
        setProductSalesQty(res);
      }
    );
  }, [dateRange, productName]);

  const data = {
    labels: productSalesQty.map((prodSale) =>
      moment(prodSale.createddate).format(READABLE_DDMM)
    ),
    datasets: [
      {
        label: 'Quantity',
        data: productSalesQty.map((prodSale) => prodSale.total),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <Card style={{ padding: '0.5em 2em 2em', height: '48vh' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
        className='container-center'
      >
        <h3>Sales By Product</h3>
        <FormControl style={{ width: '70%' }}>
          <InputLabel id='demo-simple-select-label'>Select Product</InputLabel>
          <Select
            size='small'
            value={productName}
            label='Select Product'
            onChange={handleChange}
          >
            {bestsellers.map((bestseller) => {
              return (
                <MenuItem value={bestseller.productname}>
                  {bestseller.productname}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <Divider className='full-divider' />
      {!!productSalesQty.length && (
        <div>
          <Line
            data={data}
            options={options}
            style={{ width: '100%', height: '20vh' }}
          />
        </div>
      )}
    </Card>
  );
};

export default ProductSalesChart;
