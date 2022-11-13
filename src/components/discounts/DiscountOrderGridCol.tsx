import { Button } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import _ from 'lodash';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import { DD_MM_YYYY } from 'src/utils/dateUtils';

export const DiscountOrderActionCell = ({ id, row }: GridRenderCellParams) => {
  const navigate = useNavigate();
  const navToViewDiscountCode = () =>
    navigate({
      pathname: '/discountCode/discountCodeDetail',
      search: createSearchParams({
        id: id.toString()
      }).toString()
    });
  return (
    <div className='action-cell'>
      {!(row.orderStatus === 'CREATED' || row.orderStatus === 'CANCELLED') && (
        <Button variant='contained' onClick={() => navToViewDiscountCode()}>
          View Discount Code
        </Button>
      )}
    </div>
  );
};

export const discountOrderGridCols: GridColDef[] = [
  { field: 'discountCode', headerName: 'Discount Code', flex: 1 },
  {
    field: 'type',
    headerName: 'Discount Type',
    flex: 1,
    valueFormatter: (params) =>
      _.startCase(params.value.toString().toLowerCase())
  },
  { field: 'amount', headerName: 'Amount', flex: 1 },
  {
    field: 'startDate',
    headerName: 'Start Date',
    flex: 1,
    valueFormatter: (params) => moment(params.value).format(DD_MM_YYYY)
  },
  {
    field: 'endDate',
    headerName: 'End Date',
    flex: 1,
    valueGetter: (params) => params.row.endDate ?? 'NA',
    valueFormatter: (params) =>
      params.value !== 'NA' ? moment(params.value).format(DD_MM_YYYY) : 'NA'
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'center',
    flex: 1,
    renderCell: DiscountOrderActionCell
  }
];

export const customerEmailGridCol: GridColDef[] = [
  {
    field: 'email',
    headerName: 'Emails allowed to use this discount code',
    headerAlign: 'center',
    flex: 1,
    valueGetter: (params) => params.row
  },
];
