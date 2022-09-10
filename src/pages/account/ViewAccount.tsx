import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    FormGroup,
    TextField,
    Paper,
    MenuItem,
    Button,
    IconButton,
    Tooltip
} from '@mui/material';
import '../../styles/pages/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';

const units = [
    {
        value: 'ea',
        label: 'Each'
    },
    {
        value: 'ptk',
        label: 'Packet'
    },
    {
        value: 'ctn',
        label: 'Carton'
    }
];

const categories = [
    {
        value: 'popcorn',
        label: 'Popcorn'
    },
    {
        value: 'sticks',
        label: 'Sticks'
    }
];

const tags = [
    {
        value: 'snack',
        label: 'Snack'
    },
    {
        value: 'nonSnack',
        label: 'Non Snack'
    }
];

// type ViewAccountSearchParams = URLSearchParams & {
//     id: string | null;
//     edit: boolean;
// };

const ViewAccount = () => {
    // const params = new Proxy<Partial<ViewAccountSearchParams>>(
    //     new URLSearchParams(window.location.search),
    //     {
    //         get: (searchParams: URLSearchParams, prop: string) =>
    //             searchParams.get(prop)
    //     }
    // );
    // const { id, edit} = params;


    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [unit, setUnit] = useState<String>('');
    const [category, setCategory] = useState<String>('');
    const [tag, setTag] = useState<String>('');    
    const [editable, setEditable] = useState<Boolean>();

    const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUnit(event.target.value);
    };
    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(event.target.value);
    };
    const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTag(event.target.value);
    };

    const handleEditButtonClick = () => {
        setEditable(!(searchParams.get('edit') as boolean))
        setSearchParams({edit: editable});
    };

    return (
        <>
            <Tooltip title='Return to Accounts' enterDelay={300}>
                <IconButton size='large' onClick={() => navigate('/accounts')}>
                    <ChevronLeft />
                </IconButton>
            </Tooltip>
            <div className='create-product'>
                <Box className='create-product-box'>
                    <div className='header-content'>
                        <h1>View User ID: {searchParams.get("id")} </h1>
                        <div className='button-group'>
                            <Button
                                variant='contained'
                                className='create-btn'
                                color='primary'
                                onClick={() => {
                                    handleEditButtonClick()
                                }}
                            >
                                EDIT
                            </Button>
                            <Button
                                type='submit'
                                variant='contained'
                                className='create-btn'
                                color='primary'
                            >
                                DELETE
                            </Button>
                            <Button
                                type='submit'
                                variant='contained'
                                className='create-btn'
                                color='primary'
                            >
                                DISABLE
                            </Button>
                        </div>
                    </div>

                    <Paper elevation={2}>
                        <form>
                            <FormGroup className='create-product-form'>
                                <div className='top-content'>
                                    <Box
                                        sx={{
                                            width: 200,
                                            height: 200,
                                            backgroundColor: 'primary.dark',
                                            '&:hover': {
                                                backgroundColor: 'primary.main',
                                                opacity: [0.9, 0.8, 0.7]
                                            }
                                        }}
                                    />

                                    <div className='text-fields'>

                                        <TextField
                                            disabled={!!searchParams.get("edit")}
                                            id="outlined-disabled"
                                            label="Disabled"
                                            defaultValue="Hello World"
                                        />
                                        <TextField
                                            required
                                            fullWidth
                                            id='outlined-required'
                                            label='SKU'
                                            name='sku'
                                            placeholder='eg.: SKU12345678'
                                        />
                                        <TextField
                                            required
                                            fullWidth
                                            id='outlined-required'
                                            label='Product Name'
                                            name='productName'
                                            placeholder='eg.: Nasi Lemak Popcorn'
                                        />
                                        <div className='row-group'>
                                            <TextField
                                                required
                                                fullWidth
                                                id='outlined-field'
                                                label='Price'
                                                name='price'
                                                placeholder='eg.: $10'
                                            />

                                            <TextField
                                                required
                                                fullWidth
                                                id='outlined-field'
                                                select
                                                label='Unit'
                                                value={unit}
                                                onChange={handleUnitChange}
                                            >
                                                {units.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                required
                                                fullWidth
                                                id='outlined-quantity'
                                                label='Quantity'
                                                name='quantity'
                                                placeholder='eg.: 12'
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='row-group'>
                                    <TextField
                                        id='outlined-select-category'
                                        fullWidth
                                        select
                                        label='Category'
                                        value={category}
                                        onChange={handleCategoryChange}
                                    >
                                        {categories.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        id='outlined-select-unit'
                                        fullWidth
                                        select
                                        label='Tags'
                                        value={tag}
                                        onChange={handleTagChange}
                                    >
                                        {tags.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>

                                <TextField
                                    id='standard-multiline-static'
                                    label='Comments'
                                    multiline
                                    rows={3}
                                    placeholder='Insert comments here...'
                                    variant='standard'
                                />

                                <div className='view-button-group'>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        className='create-btn'
                                        color='primary'
                                        onClick={() => {
                                            navigate('/products');
                                        }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </FormGroup>
                        </form>
                    </Paper>
                </Box>
            </div>
        </>
    );
};

export default ViewAccount;
