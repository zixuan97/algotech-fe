import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import SupplierCellAction from 'src/components/procurement/SupplierCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Supplier } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllSuppliers } from 'src/services/supplierService';
import { useNavigate } from 'react-router';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Supplier Name', flex: 1 },
  { field: 'email', headerName: 'Supplier Email', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: SupplierCellAction
  }
];

const AllSuppliers = () => {
  const navigate = useNavigate();

  const [searchField, setSearchField] = React.useState<string>('');
  const [supplierData, setSupplierData] = React.useState<Supplier[]>([]);
  const [filteredData, setFilteredData] = React.useState<Supplier[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getAllSuppliers(),
      (res) => {
        setLoading(false);
        setSupplierData(res);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? supplierData.filter((category) =>
            Object.values(category).some((value) =>
              String(value).toLowerCase().match(searchField.toLowerCase())
            )
          )
        : supplierData
    );
  }, [searchField, supplierData]);

  console.log(filteredData);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // here
    setSearchField(e.target.value);
  };

  return (
    <div className='product-inventory'>
      <h1>All Suppliers</h1>
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
          onClick={() => navigate({ pathname: '/procurementOrders/createSupplier' })}
        >
          Create Supplier
        </Button>
      </div>
      <DataGrid
        columns={columns}
        rows={filteredData}
        autoHeight
        loading={loading}
      />
    </div>
  );
};

export default AllSuppliers;
