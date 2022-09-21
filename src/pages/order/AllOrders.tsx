import React from 'react';
import '../../styles/pages/orders.scss';
import '../../styles/common/common.scss';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper  } from '@mui/material';
import { Search, Download } from '@mui/icons-material';
import { useNavigate } from 'react-router';


const AllOrders = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [searchField, setSearchField] = React.useState<string>('');

    const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchField(e.target.value);
    };

    console.log(searchField);
    
    return (
        <div className='orders'>
            <h1>All Orders</h1>
            <div className='grid-toolbar'>
                <div className='search-bar'>
                    <Search />
                    <TextField
                        id='search'
                        label='Search'
                        margin='normal'
                        fullWidth
                        placeholder='Input Platform Name ...'
                        onChange={handleSearchFieldChange}
                    />
                </div>
                <Button
                    variant='contained'
                    size='large'
                    sx={{ height: 'fit-content' }}
                    endIcon={<Download />}
                    onClick={() => {}}
                >
                   Download CSV
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Order Items</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Platform</TableCell>
                            <TableCell>Order Amount</TableCell>
                            <TableCell>Delivery Details</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AllOrders;
