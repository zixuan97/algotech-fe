import React from 'react';
import TimeoutAlert, { AlertType } from '../common/TimeoutAlert';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  Menu,
  Typography,
  Stack,
  TextField,
  Divider,
  Button,
  Backdrop,
  CircularProgress
} from '@mui/material';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { filterAndGetCustomers } from 'src/services/customerService';
import { Customer } from 'src/models/types';

type FilterCustomersMenuProps = {
  updateCustomers: (customers: Customer[]) => void;
};

const FilterCustomersMenu = ({ updateCustomers }: FilterCustomersMenuProps) => {
  const [daysSinceLastPurchaseString, setDaysSinceLastPurchase] =
    React.useState<string>('');
  const [allTimeOrderValueString, setAllTimeOrderValue] =
    React.useState<string>('');
  const [minAvgOrderValueString, setMinAvgOrderValue] =
    React.useState<string>('');
  const [maxAvgOrderValueString, setMaxAvgOrderValue] =
    React.useState<string>('');
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleEditCustomerFilters = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.name === 'daysSinceLastPurchase') {
      await setDaysSinceLastPurchase(e.target.value);
    } else if (e.target.name === 'allTimeOrderValue') {
      await setAllTimeOrderValue(e.target.value);
    } else if (e.target.name === 'minAvgOrderValue') {
      await setMinAvgOrderValue(e.target.value);
    } else {
      await setMaxAvgOrderValue(e.target.value);
    }
  };

  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterCustomers = async () => {
    let daysSinceLastPurchase = Number(daysSinceLastPurchaseString);
    let allTimeOrderValue = Number(allTimeOrderValueString);
    let minAvgOrderValue = Number(minAvgOrderValueString);
    let maxAvgOrderValue = Number(maxAvgOrderValueString);

    if (
      (daysSinceLastPurchaseString !== '' && daysSinceLastPurchase < 0) ||
      (allTimeOrderValueString !== '' && allTimeOrderValue < 0) ||
      (minAvgOrderValueString !== '' && minAvgOrderValue < 0) ||
      (maxAvgOrderValueString !== '' && maxAvgOrderValue < 0)
    ) {
      setAlert({
        severity: 'warning',
        message: 'All filter values must be positive!'
      });
      return;
    }

    if (minAvgOrderValueString !== '' && maxAvgOrderValueString === '') {
      setAlert({
        severity: 'warning',
        message: 'Please enter a max average order value!'
      });
      return;
    }

    if (maxAvgOrderValueString !== '' && minAvgOrderValueString === '') {
      setAlert({
        severity: 'warning',
        message: 'Please enter a min average order value!'
      });
      return;
    }

    if (minAvgOrderValue > maxAvgOrderValue) {
      setAlert({
        severity: 'warning',
        message:
          'Please ensure min average order value is less than max average order value!'
      });
      return;
    }

    setAnchorEl(null);

    let reqBody = Object.assign(
      {},
      daysSinceLastPurchase && { daysSinceLastPurchase },
      allTimeOrderValue && { allTimeOrderValue },
      minAvgOrderValue && { minAvgOrderValue },
      maxAvgOrderValue && { maxAvgOrderValue }
    );

    setLoading(true);

    await asyncFetchCallback(
      filterAndGetCustomers(reqBody),
      (res) => {
        updateCustomers(res);
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  const clearFilters = async () => {
    setAnchorEl(null);

    await setDaysSinceLastPurchase('');
    await setAllTimeOrderValue('');
    await setMinAvgOrderValue('');
    await setMaxAvgOrderValue('');

    await asyncFetchCallback(
      filterAndGetCustomers({}),
      (res) => {
        updateCustomers(res);
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  return (
    <div className='schedule-newsletter-customers-toolbar'>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <div className='schedule-newsletter-filter-button-container'>
        <Button
          id='basic-button'
          variant='outlined'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          startIcon={<FilterAltIcon />}
          onClick={handleOpenFilterMenu}
        >
          Manage Filters
        </Button>
      </div>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleFilterMenuClose}
        disableAutoFocusItem
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        keepMounted
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <h3 className='filter-menu-heading'>Filter By</h3>
        {alert && (
          <div className='filter-customers-alert'>
            <TimeoutAlert
              alert={alert}
              timeout={6000}
              clearAlert={() => setAlert(null)}
            />
          </div>
        )}
        <Stack direction='column' spacing={2} paddingLeft='1rem'>
          <Stack direction='column' spacing={2} paddingRight='1rem'>
            <Typography>Days Since Last Purchase</Typography>
            <TextField
              name='daysSinceLastPurchase'
              type='number'
              value={daysSinceLastPurchaseString}
              onChange={handleEditCustomerFilters}
              sx={{ width: 165 }}
            />
          </Stack>
          <Divider />
          <Stack direction='column' spacing={2} paddingRight='1rem'>
            <Typography>All Time Order Value</Typography>
            <TextField
              name='allTimeOrderValue'
              type='number'
              value={allTimeOrderValueString}
              onChange={handleEditCustomerFilters}
              sx={{ width: 165 }}
            />
          </Stack>
          <Divider />
          <Stack direction='column' spacing={2} paddingRight='1rem'>
            <Typography>Average Order Value</Typography>
            <Stack direction='row' spacing={2} alignItems='center'>
              <TextField
                name='minAvgOrderValue'
                label='Min'
                type='number'
                value={minAvgOrderValueString}
                onChange={handleEditCustomerFilters}
                fullWidth
              />
              <Typography>to</Typography>
              <TextField
                name='maxAvgOrderValue'
                label='Max'
                type='number'
                value={maxAvgOrderValueString}
                onChange={handleEditCustomerFilters}
                fullWidth
              />
            </Stack>
          </Stack>
          <Stack
            direction='row'
            spacing={2}
            paddingRight='1rem'
            paddingTop='3rem'
            paddingBottom='1rem'
            justifyContent='flex-end'
          >
            <Button
              variant='contained'
              size='medium'
              sx={{ height: 'fit-content' }}
              onClick={handleFilterCustomers}
            >
              Filter
            </Button>
            <Button
              variant='outlined'
              size='medium'
              sx={{ height: 'fit-content' }}
              onClick={clearFilters}
            >
              Clear
            </Button>
          </Stack>
        </Stack>
      </Menu>
    </div>
  );
};

export default FilterCustomersMenu;
