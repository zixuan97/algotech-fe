import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import '../../styles/pages/customer/customer.scss';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getAllNewsletterTemplates } from 'src/services/customerService';
import { NewsletterTemplate } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import ViewNewsletterButton from 'src/components/customers/ViewNewsletterButton';

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

  return (
    <div className='newsletter-templates'>
      <h1>Newsletter Templates</h1>
      <div className='newsletter-templates-toolbar'>
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
      <DataGrid
        columns={columns}
        loading={loading}
        rows={newsletterTemplates}
        autoHeight
      />
    </div>
  );
};

export default NewsletterTemplates;
