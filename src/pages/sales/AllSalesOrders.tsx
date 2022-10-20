import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/pages/sales/orders.scss';
import '../../styles/common/common.scss';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
  Typography,
  Divider,
  InputLabel,
  FormControl,
  CircularProgress
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { OrderStatus, PlatformType } from 'src/models/types';
import SalesOrderTable from 'src/components/sales/order/SalesOrderTable';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import moment from 'moment';
import { SalesOrder } from '../../models/types/index';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getSalesOrdersByRangeSvc } from 'src/services/salesService';
import _ from 'lodash';

let platforms = Object.keys(PlatformType).filter((v) => isNaN(Number(v)));
platforms.unshift('ALL');

let status = Object.keys(OrderStatus).filter((v) => isNaN(Number(v)));
status.unshift('ALL');

const AllSalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [searchField, setSearchField] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('day').subtract(10, 'day'),
    moment().endOf('day')
  ]);

  useEffect(() => {
    setLoading(true);
    asyncFetchCallback(getSalesOrdersByRangeSvc(dateRange), (res) => {
      setSalesOrders(res);
      setLoading(false);
    });
  }, [dateRange]);

  const filteredData = useMemo(
    () =>
      filterPlatform || searchField || filterStatus
        ? salesOrders.filter((saleOrder) => {
            const searchFieldLower = searchField.toLowerCase().trim();
            if (filterPlatform === 'ALL' && filterStatus === 'ALL') {
              return (
                saleOrder.customerAddress
                  .toLowerCase()
                  .includes(searchFieldLower) ||
                saleOrder.orderId.toLowerCase().includes(searchFieldLower) ||
                saleOrder.salesOrderItems.some((item) =>
                  item.productName?.toLowerCase().includes(searchFieldLower)
                ) ||
                _.startCase(saleOrder.orderStatus)
                  .toLowerCase()
                  .includes(searchFieldLower)
              );
            } else {
              return (
                ((filterPlatform === 'ALL' &&
                  filterStatus !== 'ALL' &&
                  saleOrder.orderStatus === filterStatus) ||
                  (filterPlatform !== 'ALL' &&
                    filterStatus === 'ALL' &&
                    saleOrder.platformType === filterPlatform) ||
                  (filterPlatform !== 'ALL' &&
                    filterStatus !== 'ALL' &&
                    saleOrder.platformType === filterPlatform &&
                    saleOrder.orderStatus === filterStatus)) &&
                (saleOrder.customerAddress
                  .toLowerCase()
                  .includes(searchFieldLower) ||
                  saleOrder.orderId.toLowerCase().includes(searchFieldLower) ||
                  saleOrder.salesOrderItems.some((item) =>
                    item.productName?.toLowerCase().includes(searchFieldLower)
                  ) ||
                  _.startCase(saleOrder.orderStatus)
                    .toLowerCase()
                    .includes(searchFieldLower))
              );
            }
          })
        : salesOrders,
    [filterPlatform, searchField, filterStatus, salesOrders]
  );

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterPlatform(event.target.value);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value);
  };

  return (
    <div className='orders'>
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>Sales Order Fulfilment</h1>
        <Stack direction='row' spacing={3}>
          {loading && <CircularProgress color='secondary' />}
          <Typography className='container-center'>View sales from</Typography>
          <DateRangePicker
            dateRange={dateRange}
            updateDateRange={setDateRange}
          />
        </Stack>
      </Stack>
      <Divider className='full-divider' />
      <div className='order-grid-toolbar'>
        <div className='search-bar'>
          <FilterList />
          <FormControl style={{ width: '50%' }}>
            <InputLabel id='search-platform'>Status</InputLabel>
            <Select
              id='search-status'
              value={filterStatus}
              label='Status'
              placeholder='Status'
              onChange={handleStatusChange}
            >
              {status.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ width: '50%' }}>
            <InputLabel id='search-platform'>Platform</InputLabel>
            <Select
              id='search-platform'
              value={filterPlatform}
              label='Platform'
              placeholder='Platform'
              onChange={handleFilterChange}
            >
              {platforms.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Search />
          <TextField
            id='search'
            label='Search'
            fullWidth
            value={searchField}
            placeholder='Address, OrderId, Product Name, Status'
            onChange={handleSearchFieldChange}
          />
          <Button
            variant='contained'
            size='large'
            sx={{ height: 'fit-content' }}
            onClick={() => {
              setSearchField('');
              setFilterPlatform('ALL');
              setFilterStatus('ALL');
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <SalesOrderTable filteredData={filteredData} />
    </div>
  );
};

export default AllSalesOrders;
