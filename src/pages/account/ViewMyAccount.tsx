import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    Grid,
    Button,
    Alert,
    Typography,
    CircularProgress
} from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft, Visibility, VisibilityOff } from '@mui/icons-material';
import asyncFetchCallback from '../../../src/services/util/asyncFetchCallback';
import { User } from 'src/models/types';
import { roles } from 'src/components/account/accountTypes';
import { editUserSvc, getUserDetailsSvc } from 'src/services/accountService';
import { AlertType } from 'src/components/common/Alert';

const placeholderUser: User = {
    //note: id is temp holder, BE doesn't consume id on create
    id: 0,
    email: '',
    role: '',
    status: '',
    first_name: '',
    last_name: '',
    password: '',
    isVerified: true
};

const ViewMyAccount = () => {
    const navigate = useNavigate();
    let params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const [user, setUser] = useState<User>(placeholderUser);
    const [edit, setEdit] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        id &&
            asyncFetchCallback(
                getUserDetailsSvc(id),
                (user: User) => {
                    setUser(user);
                },
                () => {
                    //handle error here
                }
            );
    }, []);

    const userFieldOnChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        key: string
    ) => {
        setUser((paramUser: User) => {
            return {
                ...paramUser,
                [key]: event.target.value
            };
        });
    };

    const handleSaveButtonClick = (e: any) => {
        e.preventDefault();
        setLoading(true);
        asyncFetchCallback(
            editUserSvc(user!),
            () => {
                setLoading(false);
                setAlert({
                    severity: 'success',
                    message: 'Account edited.'
                });
                navigate(`/accounts/viewMyAccount?id=${id}`);
            },
            (err) => {
                setLoading(false);
                setAlert({
                    severity: 'error',
                    message: 'Error saving changes for account! Try again later.'
                });
            }
        );
    };

    return (
        <>
            <Tooltip title='Return to Accounts' enterDelay={300}>
                <IconButton size='large' onClick={() => navigate('/accounts')}>
                    <ChevronLeft />
                </IconButton>
            </Tooltip>

            <div className='center-div'>
                <Box className='center-box'>
                    <div className="header-content">
                        <h1>Your Profile Page</h1>
                        <div className='button-group'>
                        {loading && <CircularProgress color='secondary' />}
                            {edit && (
                                <Button
                                    variant='contained'
                                    className='create-btn'
                                    color='primary'
                                    onClick={() => {
                                        setEdit(false);
                                    }}
                                >
                                    DISCARD CHANGES
                                </Button>
                            )}
                            <Button
                                variant='contained'
                                className='create-btn'
                                color='primary'
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    if (!edit) {
                                        setEdit(true);
                                    } else {
                                        handleSaveButtonClick(e);
                                        setEdit(false);
                                    }
                                }}
                            >
                                {edit ? 'SAVE CHANGES' : 'EDIT'}
                            </Button>
                        </div>
                    </div>

                    {alert && (
                        <Alert severity={alert.severity} onClose={() => setAlert(null)} style={{margin: '1%'}}>
                            {alert.message}
                        </Alert>
                    )}
                    <Paper elevation={2}>
                        <form>
                            <div className='content-body'>
                                <div className='right-content'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            {edit ? (
                                                <TextField
                                                    fullWidth
                                                    required
                                                    id='outlined-quantity'
                                                    label='First Name'
                                                    name='firstName'
                                                    placeholder='eg.: John'
                                                    value={user?.first_name}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        userFieldOnChange(e, 'first_name')
                                                    }
                                                />
                                            ) : (
                                                <div>
                                                    <h4>First Name</h4>
                                                    <Typography>
                                                        {user?.first_name}
                                                    </Typography>
                                                </div>
                                            )}
                                        </Grid>
                                        <Grid item xs={6}>
                                            {edit ? (
                                                <TextField
                                                    fullWidth
                                                    required
                                                    id='outlined-quantity'
                                                    label='Last Name'
                                                    name='lastName'
                                                    placeholder='eg.: Tan'
                                                    value={user?.last_name}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        userFieldOnChange(e, 'last_name')
                                                    }
                                                />
                                            ) : (
                                                <div>
                                                    <h4>Last Name</h4>
                                                    <Typography>
                                                        {user?.last_name}
                                                    </Typography>
                                                </div>
                                            )}
                                        </Grid>
                                        <Grid item xs={edit ? 12 : 6}>
                                            {edit ? (
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id='outlined-quantity'
                                                    label='Email'
                                                    name='email'
                                                    placeholder='eg.: johntan@gmail.com'
                                                    value={user?.email}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        userFieldOnChange(e, 'email')
                                                    }
                                                />
                                            ) : (
                                                <div>
                                                    <h4>Email</h4>
                                                    <Typography>
                                                        {user?.email}
                                                    </Typography>
                                                </div>
                                            )}
                                        </Grid>
                                        <Grid item xs={edit ? 12 : 6}>
                                            {edit ? (
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id='outlined-field'
                                                    select
                                                    label='Role'
                                                    value={user?.role}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        userFieldOnChange(e, 'role')
                                                    }
                                                >
                                                    {roles.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            ) : (
                                                <div>
                                                    <h4>Role</h4>
                                                    <Typography>
                                                        {user?.role}
                                                    </Typography>
                                                </div>
                                            )}
                                        </Grid>

                                        {/* <Grid item xs={6}>
                                            <OutlinedInput
                                                fullWidth
                                                disabled
                                                type={showPassword ? 'text' : 'password'}
                                                id='outlined-quantity'
                                                label='Password'
                                                name='password'
                                                value={user?.password}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    userFieldOnChange(e, 'password')
                                                }
                                                endAdornment={
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            aria-label='toggle password visibility'
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge='end'
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff />
                                                            ) : (
                                                                <Visibility />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </Grid> */}
                                    </Grid>
                                </div>
                            </div>
                        </form>
                    </Paper>
                </Box>
            </div>
        </>
    );
};

export default ViewMyAccount;
