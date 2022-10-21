import React from 'react';
import { useNavigate } from 'react-router';
import { Button, TextField } from '@mui/material';
import '../../styles/pages/customer/customer.scss';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getAllNewsletterTemplates } from 'src/services/customerService';
import { NewsletterTemplate } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import ViewNewsletterButton from 'src/components/customers/ViewNewsletterButton';
import { Search } from '@mui/icons-material';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Newsletter Name', flex: 1 },
  { field: 'emailSubject', headerName: 'Email Subject', flex: 1 },
  { field: 'discountCode', headerName: 'Discount Code', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    type: 'number',
    flex: 1,
    renderCell: ViewNewsletterButton
  }
];

const NewsletterTemplates = () => {
  const navigate = useNavigate();

  const [newsletterTemplates, setNewsletterTemplates] = React.useState<
    NewsletterTemplate[]
  >([]);
  const [filteredNewsletterTemplates, setFilteredNewsletterTemplates] =
    React.useState<NewsletterTemplate[]>([]);
  const [searchField, setSearchField] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllNewsletterTemplates(),
      (res) => {
        setLoading(false);
        setNewsletterTemplates(res);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    setFilteredNewsletterTemplates(
      searchField
        ? newsletterTemplates.filter((template) =>
            Object.values(template).some((value) =>
              String(value).toLowerCase().includes(searchField.toLowerCase())
            )
          )
        : newsletterTemplates
    );
  }, [searchField, newsletterTemplates]);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };

  return (
    <div className='newsletter-templates'>
      <h1>Newsletter Templates</h1>
      <div className='newsletter-templates-toolbar'>
        <div className='search-bar'>
          <Search />
          <TextField
            id='search'
            label='Search'
            margin='normal'
            placeholder='Newsletter Name, Email Subject or Discount Code'
            fullWidth
            onChange={handleSearchFieldChange}
          />
        </div>
        <div className='newsletter-templates-button-container'>
          <Button
            variant='contained'
            size='medium'
            sx={{ height: 'fit-content' }}
            onClick={() =>
              navigate({ pathname: '/customer/createNewsletterTemplate' })
            }
          >
            Create Newsletter Template
          </Button>
        </div>
      </div>
      <DataGrid
        columns={columns}
        loading={loading}
        rows={filteredNewsletterTemplates}
        autoHeight
      />
    </div>
  );
};

export default NewsletterTemplates;
