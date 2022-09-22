import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/pages/orders.scss';
import '../../styles/common/common.scss';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Collapse,
  Box,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import {
  Search,
  Download,
  FilterList,
  KeyboardArrowUp,
  KeyboardArrowDown
} from '@mui/icons-material';
import { PlatformType, SalesOrder } from 'src/models/types';
import { salesOrderData } from 'src/components/sales/salesOrder';
import { useNavigate } from 'react-router-dom';

const platforms = Object.keys(PlatformType).filter((v) => isNaN(Number(v)));

const Row = ({ row }: { row: Partial<SalesOrder> }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align='center'>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row' align='center'>
          {row.customerName}
        </TableCell>

        <TableCell align='center'>{row.status}</TableCell>
        <TableCell align='center'>
          <Chip
            label={row.platformType}
            color={
              row.platformType === PlatformType.SHOPEE
                ? 'warning'
                : row.platformType === PlatformType.SHOPIFY
                ? 'primary'
                : 'info'
            }
          />
        </TableCell>
        <TableCell align='center'>${row.amount}</TableCell>
        <TableCell align='center'>{row.customerAddress ?? 'NA'}</TableCell>
        <TableCell align='center'>
          <Button
            variant='contained'
            size='large'
            sx={{ height: 'fit-content' }}
            onClick={() => navigate('/sales/orderDetails')}
          >
            Manage Order
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: '2%' }}>
              {row.salesOrderItems?.map((item) => {
                return (
                  <Grid container spacing={1} style={{ alignItems: 'center' }}>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={1}>
                      <b>
                        {item.productName ?? 'NA'} x{item.quantity}, $
                        {item.price}
                      </b>
                    </Grid>
                    <Grid item xs={1}>
                      <b>${item.quantity * item.price}</b>
                    </Grid>
                  </Grid>
                );
              })}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const AllOrders = () => {
  const [salesOrders, setSalesOrders] =
    useState<Partial<SalesOrder>[]>(salesOrderData);
  const [searchField, setSearchField] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('');

  const filteredData = useMemo(
    () =>
      filterPlatform || searchField
        ? salesOrders.filter(
            (saleOrder) =>
              (!filterPlatform || saleOrder.platformType === filterPlatform) &&
              Object.values(saleOrder).some((value) =>
                String(value).toLowerCase().match(searchField.toLowerCase())
              )
          )
        : salesOrders,
    [salesOrders, filterPlatform, searchField]
  );

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterPlatform(event.target.value);
  };

  console.log(filteredData);

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
              setFilterPlatform('');
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
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align='center'>Order For</TableCell>
              <TableCell align='center'>Status</TableCell>
              <TableCell align='center'>Platform</TableCell>
              <TableCell align='center'>Order Amount</TableCell>
              <TableCell align='center'>Delivery Details</TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((salesOrder) => (
              <Row key={salesOrder.id} row={salesOrder} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllOrders;
