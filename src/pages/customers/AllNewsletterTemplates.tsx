import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import '../../styles/pages/customer/customer.scss';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Newsletter Name', flex: 1 },
  { field: 'emailSubject', headerName: 'Email Subject', flex: 1 },
  { field: 'discountCode', headerName: 'Discount Code', flex: 1 }
];

const data = [
  {
    id: 1,
    name: 'Christmas 2022',
    emailSubject: 'Christmas with Kettle Gourmet!',
    discountCode: 'XMAS22'
  }
];

const NewsletterTemplates = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState<boolean>(false);

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
      <DataGrid columns={columns} loading={loading} rows={data} autoHeight />
    </div>
  );
};

export default NewsletterTemplates;
