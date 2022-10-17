import React from 'react';
import { Search } from '@mui/icons-material';
import { BundleCatalogue } from '../../models/types';
import { useNavigate } from 'react-router';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import BundleCatalogueCellAction from '../../components/catalogue/BundleCatalogueCellAction';
import { Button, TextField } from '@mui/material';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { getAllBundleCatalogues } from '../../services/bundleCatalogueService';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Bundle Name',
    // valueFormatter: (params) => params.value.name,
    valueGetter: (params: GridValueGetterParams) => params.row.bundle.name,
    flex: 2
  },
  {
    field: 'price',
    headerName: 'Price',
    valueFormatter: (params) => params.value.toFixed(2),
    flex: 1
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: BundleCatalogueCellAction
  }
];

const AllCatalogueBundles = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [bundleCatalogueData, setBundleCatalogueData] = React.useState<
    BundleCatalogue[]
  >([]);
  const [filteredData, setFilteredData] = React.useState<BundleCatalogue[]>([]);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllBundleCatalogues(),
      (res) => {
        setLoading(false);
        setBundleCatalogueData(res);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? bundleCatalogueData.filter((bundleCatalogueItem) => {
            const searchFieldLower = searchField.toLowerCase().trim();
            return (
              bundleCatalogueItem.bundle.name
                ?.toLowerCase()
                .includes(searchFieldLower) ||
              bundleCatalogueItem.price
                .toString()
                .toLowerCase()
                .includes(searchFieldLower)
            );
          })
        : bundleCatalogueData
    );
  }, [searchField, bundleCatalogueData]);

  console.log(filteredData);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };

  return (
    <div className='product-inventory'>
      <h1>Manage Bundle Catalogue</h1>
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
          onClick={() =>
            navigate({ pathname: '/catalogue/createCatalogueBundle' })
          }
        >
          Create Catalogue Bundle
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

export default AllCatalogueBundles;
