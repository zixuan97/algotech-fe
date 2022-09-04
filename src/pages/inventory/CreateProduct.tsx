import React, { useState } from 'react';
import {
    Box,
    FormGroup,
    TextField,
    Paper,
    MenuItem,
    Button
} from '@mui/material';
import '../../styles/pages/inventory.scss';

const units = [
    {
        value: 'ea',
        label: 'Each',
    },
    {
        value: 'ptk',
        label: 'Packet',
    },
    {
        value: 'ctn',
        label: 'Carton',
    }
];

const categories = [
    {
        value: 'popcorn',
        label: 'Popcorn',
    },
    {
        value: 'sticks',
        label: 'Sticks',
    }
];

const tags = [
    {
        value: 'snack',
        label: 'Snack',
    },
    {
        value: 'nonSnack',
        label: 'Non Snack',
    }
];

const CreateProduct = () => {
    const [unit, setUnit] = useState('');
    const [category, setCategory] = useState('');
    const [tag, setTag] = useState('');

    const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUnit(event.target.value);
    };
    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(event.target.value);
    };
    const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTag(event.target.value);
    };

    return (
        <div className='createProduct'>
            <Box className='createProduct-box'>
                <Paper>
                    <h1>Create New Product</h1>
                    <form className='create-product-container'>
                        <FormGroup>
                            <TextField
                                required
                                id='outlined-required'
                                label='SKU'
                                name='sku'
                                placeholder='eg.: SKU12345678'
                            />
                            <TextField
                                required
                                id='outlined-required'
                                label='Product Name'
                                name='productName'
                                placeholder='eg.: Nasi Lemak Popcorn'
                            />
                            <>
                                <TextField
                                    required
                                    id='outlined-required'
                                    label='Price'
                                    name='price'
                                    placeholder='eg.: $10'
                                />
                                <TextField
                                    id="outlined-select-unit"
                                    select
                                    label="Unit"
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
                                    id='outlined-required'
                                    label='Quantity'
                                    name='quantity'
                                    placeholder='eg.: 12'
                                />
                            </>

                            <>
                                <TextField
                                    id="outlined-select-unit"
                                    select
                                    label="Category"
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
                                    id="outlined-select-unit"
                                    select
                                    label="Tags"
                                    value={tag}
                                    onChange={handleTagChange}
                                >
                                    {tags.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </>


                            <TextField
                                id="standard-multiline-static"
                                label="Comments"
                                multiline
                                rows={4}
                                placeholder='Insert comments here...'
                                variant="standard"
                            />
                        </FormGroup>

                        <Button
                            variant='text'
                            className='cancel-btn'
                            color='primary'
                        >
                            CANCEL
                        </Button>
                        <Button
                            type='submit'
                            variant='contained'
                            className='create-btn'
                            color='primary'
                        >
                            CREATE PRODUCT
                        </Button>
                    </form>
                </Paper>
            </Box>
        </div>
    );
};

export default CreateProduct;
