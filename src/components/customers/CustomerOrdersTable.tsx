import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { SalesOrder } from 'src/models/types';
import PlatformChip from 'src/components/sales/order/PlatformChip'

interface props {
  filteredData: SalesOrder[];
}

  const Row = ({ row }: { row: SalesOrder }) => {
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
            {open ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row' align='center'>
          {moment(row.createdTime).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell
          align='center'
          style={{
            whiteSpace: 'normal',
            wordWrap: 'break-word'
          }}
        >
          {row.customerAddress ?? 'NA'}
        </TableCell>
        <TableCell align='center'>
          <Chip label={_.startCase(row.orderStatus.toLowerCase())} />
        </TableCell>
        <TableCell align='center'>
          <PlatformChip salesOrder={row!} />
        </TableCell>
        <TableCell align='center'>${row.amount.toFixed(2)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={!open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: '2%' }}>
              <div className='grid-toolbar'>
                <h3>Order Details</h3>
                <h3>Order ID: #{row.orderId}</h3>
              </div>

              {row.salesOrderItems?.map((item) => {
                return (
                  <>
                    <Grid
                      // key = {item.id}
                      container
                      spacing={1}
                      style={{ alignItems: 'center' }}
                    >
                      <Grid item xs={3}>
                        {item.productName ?? 'NA'} x{item.quantity}, $
                        {item.price.toFixed(2)}
                      </Grid>
                      <Grid item xs={1}>
                        ${(item.quantity * item.price).toFixed(2)}
                      </Grid>
                    </Grid>
                  </>
                );
              })}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CustomerOrderTable = ({ filteredData }: props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table
        aria-label='collapsible table'
        style={{ width: '100%', tableLayout: 'fixed' }}
      >
        <TableHead>
          <TableRow>
            <TableCell width={25} />
            <TableCell align='center'>Order Date</TableCell>
            <TableCell align='center'>Delivery Address</TableCell>
            <TableCell align='center'>Status</TableCell>
            <TableCell align='center'>Platform</TableCell>
            <TableCell align='center'>Order Amount</TableCell>

          </TableRow>
        </TableHead>
        <TableBody style={{ width: '100%' }}>
          {(rowsPerPage > 0
            ? filteredData.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : filteredData
          ).map((salesOrder) => (
            <Row key={salesOrder.id} row={salesOrder} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page'
                },
                native: true
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default CustomerOrderTable;
