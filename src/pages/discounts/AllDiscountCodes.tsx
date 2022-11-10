import React, { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import '../../styles/pages/accounts.scss';
import { Button, SelectChangeEvent, TextField } from '@mui/material';
import { DiscountCode, DiscountCodeType } from 'src/models/types';
import { Search } from '@mui/icons-material';
import DropdownFilter from 'src/components/sales/DropdownFilter';
import { useNavigate } from 'react-router';
import { getAllDiscountCodes } from 'src/services/discountCodeService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import _ from 'lodash';
import moment from 'moment';
import { DD_MM_YYYY } from 'src/utils/dateUtils';
import { discountOrderGridCols } from 'src/components/discounts/DiscountOrderGridCol';

let discountCodeType = Object.keys(DiscountCodeType).filter((v) =>
  isNaN(Number(v))
);
discountCodeType.unshift('ALL');

const AllDiscountCodes = () => {
  const navigate = useNavigate();
  const [discountCodes, setDiscountCode] = useState<DiscountCode[]>([]);
  const [searchField, setSearchField] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [filterDiscountType, setFilterDiscountType] = useState<string>('ALL');

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setFilterDiscountType(event.target.value);
  };

  useEffect(() => {
    setLoading(true);
    asyncFetchCallback(getAllDiscountCodes(), (res) => {
      setDiscountCode(res);
      setLoading(false);
    });
  }, []);

  const filteredData = useMemo(
    () =>
      filterDiscountType || searchField
        ? discountCodes.filter((discCode) => {
            const searchFieldLower = searchField.toLowerCase().trim();
            if (filterDiscountType === 'ALL') {
              return (
                discCode.discountCode
                  .toLowerCase()
                  .includes(searchFieldLower) ||
                discCode.amount.toString().includes(searchFieldLower)
              );
            } else {
              return (
                discCode.type === filterDiscountType &&
                (discCode.discountCode
                  .toLowerCase()
                  .includes(searchFieldLower) ||
                  discCode.amount.toString().includes(searchFieldLower))
              );
            }
          })
        : discountCodes,
    [filterDiscountType, searchField, discountCodes]
  );

  return (
    <div className='accounts'>
      <h1>Discount Codes</h1>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <DropdownFilter
            options={discountCodeType}
            filterString={filterDiscountType}
            handleFilterValueChange={handleStatusChange}
            labelText={'Type'}
          />
          <Search />
          <TextField
            id='search'
            label='Search'
            fullWidth
            value={searchField}
            placeholder='Discount Code, Amount'
            onChange={handleSearchFieldChange}
          />

          <Button
            variant='contained'
            size='large'
            sx={{ height: 'fit-content' }}
            onClick={() => {
              setSearchField('');
              setFilterDiscountType('ALL');
            }}
          >
            Reset
          </Button>
        </div>
        <Button
          variant='contained'
          size='large'
          sx={{ height: 'fit-content' }}
          onClick={() => {
            navigate('/discountCode/createNewDiscountCode');
          }}
        >
          Create New Discount Code
        </Button>
      </div>
      <DataGrid
        columns={discountOrderGridCols}
        rows={filteredData}
        autoHeight
        loading={loading}
      />
    </div>
  );
};

export default AllDiscountCodes;
