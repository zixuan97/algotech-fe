import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/pages/sales/orders.scss';
import '../../styles/common/common.scss';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Search, Download, FilterList } from '@mui/icons-material';
import { PlatformType } from 'src/models/types';
import salesContext from 'src/context/sales/salesContext';
import SalesOrderTable from 'src/components/sales/order/SalesOrderTable';

let platforms = Object.keys(PlatformType).filter((v) => isNaN(Number(v)));
platforms.unshift('ALL');

const AllSalesOrders = () => {
  const { salesOrders, refreshSalesOrder } = React.useContext(salesContext);
  const [searchField, setSearchField] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    refreshSalesOrder(() => setLoading(false));
  }, []);

  const filteredData = useMemo(
    () =>
      filterPlatform || searchField
        ? salesOrders.filter((saleOrder) => {
            if (filterPlatform === 'ALL') {
              return Object.values(saleOrder).some((value) =>
                String(value).toLowerCase().match(searchField.toLowerCase())
              );
            } else {
              return (
                saleOrder.platformType === filterPlatform &&
                Object.values(saleOrder).some((value) =>
                  String(value).toLowerCase().match(searchField.toLowerCase())
                )
              );
            }
          })
        : salesOrders,
    [salesOrders, filterPlatform, searchField]
  );

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterPlatform(event.target.value);
  };

  return (
    <div className='orders'>
      <h1>All Orders</h1>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <FilterList />
          <Select
            style={{ width: '50%' }}
            value={filterPlatform}
            label='Filter'
            defaultValue='ALL'
            placeholder='Platform'
            onChange={handleFilterChange}
          >
            {platforms.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Search />
          <TextField
            id='search'
            label='Search'
            fullWidth
            value={searchField}
            placeholder='Input Search Field ...'
            onChange={handleSearchFieldChange}
          />
          <Button
            variant='contained'
            size='large'
            sx={{ height: 'fit-content' }}
            onClick={() => {
              setSearchField('');
              setFilterPlatform('ALL');
            }}
          >
            Reset
          </Button>
        </div>
        <Button
          variant='contained'
          size='large'
          sx={{ height: 'fit-content' }}
          endIcon={<Download />}
          onClick={() => {}}
        >
          Download CSV
        </Button>
      </div>
      <SalesOrderTable filteredData={filteredData} />
    </div>
  );
};

export default AllSalesOrders;
