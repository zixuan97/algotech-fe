import React, { useEffect, useMemo, useState } from 'react';
import '../../../styles/pages/sales/orders.scss';
import '../../../styles/common/common.scss';
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
  FormControl
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { BulkOrder, BulkOrderStatus } from 'src/models/types';
import DateRangePicker from 'src/components/common/DateRangePicker';
import { MomentRange } from 'src/utils/dateUtils';
import moment from 'moment';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import _ from 'lodash';
import { getBulkOrdersByRangeSvc } from 'src/services/bulkOrderService';
import { DataGrid } from '@mui/x-data-grid';
import { bulkOrderColumns } from 'src/components/sales/bulkOrder/bulkOrderGridCol';

let orderStatus = Object.keys(BulkOrderStatus)
  .filter((v) => isNaN(Number(v)))
  .map((status) => {
    return _.startCase(status);
  });
orderStatus.unshift('ALL');

const AllBulkOrders = () => {
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [searchField, setSearchField] = useState<string>('');
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = React.useState<MomentRange>([
    moment().startOf('day').subtract(10, 'day'),
    moment().endOf('day')
  ]);

  useEffect(() => {
    setLoading(true);
    asyncFetchCallback(getBulkOrdersByRangeSvc(dateRange), (res) => {
      setBulkOrders(res);
      setLoading(false);
    });
  }, [dateRange]);

  const filteredData = useMemo(
    () =>
      filterOrderStatus || searchField
        ? bulkOrders.filter((bulkOrder) => {
            const searchFieldLower = searchField.toLowerCase().trim();
            if (filterOrderStatus === 'ALL') {
              return (
                bulkOrder.orderId.toString().includes(searchFieldLower) ||
                bulkOrder.payeeEmail.toLowerCase().includes(searchFieldLower) ||
                bulkOrder.payeeName.toLowerCase().includes(searchFieldLower) ||
                bulkOrder.salesOrders.some((salesOrder) => {
                  return salesOrder.salesOrderItems.some((item) => {
                    return item.productName
                      ?.toLowerCase()
                      .includes(searchFieldLower);
                  });
                }) ||
                _.startCase(bulkOrder.bulkOrderStatus)
                  .toLowerCase()
                  .includes(searchFieldLower)
              );
            } else {
              return (
                _.startCase(bulkOrder.bulkOrderStatus) === filterOrderStatus &&
                (bulkOrder.orderId.toString().includes(searchFieldLower) ||
                  bulkOrder.payeeEmail
                    .toLowerCase()
                    .includes(searchFieldLower) ||
                  bulkOrder.payeeName
                    .toLowerCase()
                    .includes(searchFieldLower) ||
                  bulkOrder.salesOrders.some((salesOrder) => {
                    return salesOrder.salesOrderItems.some((item) => {
                      return item.productName
                        ?.toLowerCase()
                        .includes(searchFieldLower);
                    });
                  }) ||
                  _.startCase(bulkOrder.bulkOrderStatus)
                    .toLowerCase()
                    .includes(searchFieldLower))
              );
            }
          })
        : bulkOrders,
    [bulkOrders, filterOrderStatus, searchField]
  );

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterOrderStatus(event.target.value);
  };

  return (
    <div className='orders'>
      <Stack
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <h1>Bulk Order Fulfilment</h1>
        <Stack direction='row' spacing={3}>
          <Typography className='container-center'>View orders from</Typography>
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
            <InputLabel id='search-order-status'>Order Status</InputLabel>
            <Select
              id='search-order-status'
              value={filterOrderStatus}
              label='Order Status'
              placeholder='Order Status'
              onChange={handleFilterChange}
            >
              {orderStatus.map((option) => (
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
              setFilterOrderStatus('');
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <DataGrid
        columns={bulkOrderColumns}
        rows={filteredData}
        autoHeight
        loading={loading}
      />
    </div>
  );
};

export default AllBulkOrders;
