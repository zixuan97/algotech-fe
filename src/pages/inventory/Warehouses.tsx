import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import WarehouseCellAction from 'src/components/inventory/WarehouseCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Location, StockQuantity } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllLocations } from 'src/services/locationService';
import { useNavigate } from 'react-router';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Warehouse Name', flex: 1 },
  {
    field: 'stockQuantity',
    headerName: 'Total Stock Quantity',
    type: 'number',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.value?.reduce(
        (prev: number, curr: StockQuantity) => prev + curr.quantity,
        0
      ) ?? 0
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: WarehouseCellAction
  }
];

const Warehouses = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [warehouseData, setWarehouseData] = React.useState<Location[]>([]);
  const [filteredData, setFilteredData] = React.useState<Location[]>([]);

  React.useEffect(() => {
    // TODO: implement error callback
    // asyncFetchCallback(getAllLocations(), setWarehouseData);
    setLoading(true);
    asyncFetchCallback(
      getAllLocations(),
      (res) => {
        setLoading(false);
        setWarehouseData(res);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? warehouseData.filter((category) =>
            Object.values(category).some((value) =>
              String(value).toLowerCase().match(searchField.toLowerCase())
            )
          )
        : warehouseData
    );
  }, [searchField, warehouseData]);

  console.log(filteredData);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // here
    setSearchField(e.target.value);
  };

  return (
    <div className='product-inventory'>
      <h1>Manage Warehouses</h1>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <Search />
          <TextField
            id='search'
            label='Search'
            margin='normal'
            fullWidth
            onChange={handleSearchFieldChange}
          />
        </div>
        <Button
          variant='contained'
          size='large'
          sx={{ height: 'fit-content' }}
          onClick={() => navigate({ pathname: '/inventory/createWarehouse' })}
        >
          Create Warehouse
        </Button>
      </div>
      <DataGrid
        columns={columns}
        rows={filteredData}
        loading={loading}
        autoHeight
      />
    </div>
  );
};

export default Warehouses;
