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
    OutlinedInput,
    InputAdornment,
} from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft, Visibility, VisibilityOff } from '@mui/icons-material';
import asyncFetchCallback from '../../../src/services/util/asyncFetchCallback';
import { User } from 'src/models/types';
import { roles } from 'src/components/account/accountTypes';
import BottomButton from 'src/components/common/BottomButton';
import { editUserSvc, getUserDetailsSvc } from 'src/services/accountService';
import { toast } from 'react-toastify';

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
    // const [showPassword, setShowPassword] = useState<Boolean>(false);

    // const handleClickShowPassword = () => {
    //     setShowPassword(!showPassword);
    // };
    // const handleMouseDownPassword = (
    //     event: React.MouseEvent<HTMLButtonElement>
    // ) => {
    //     event.preventDefault();
    // };

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

    const handleSaveButtonClick = (e: any) => {
        e.preventDefault();
        asyncFetchCallback(
            editUserSvc(user!),
            () => {
                toast.success('Account edited.', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
                navigate(`/accounts/viewMyAccount?id=${id}`);
            },
            () => {
                toast.error('Error saving changes for account! Try again later.', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
            }
        );
    };

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

    return (
        <>
            <Tooltip title='Return to Accounts' enterDelay={300}>
                <IconButton size='large' onClick={() => navigate('/accounts')}>
                    <ChevronLeft />
                </IconButton>
            </Tooltip>

            <div className='center-div'>
                <Box className='center-box'>
                    <h1>Your Profile Page</h1>
                    <Paper elevation={2}>
                        <form>
                            <div className='content-body'>
                                <div className='right-content'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                disabled
                                                fullWidth
                                                id='outlined-quantity'
                                                label='User ID'
                                                name='userId'
                                                value={user?.id}
                                                placeholder='eg.: 12'
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
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
                                        </Grid>
                                        <Grid item xs={6}>
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
                                        </Grid>
                                        <Grid item xs={6}>
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
                                        </Grid>
                                        <Grid item xs={12}>
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
                            <BottomButton
                                location='/'
                                firstButtonText='CANCEL'
                                secondButtonText='SAVE CHANGES'
                                secondButtonFn={handleSaveButtonClick}
                            />
                        </form>
                    </Paper>
                </Box>
            </div>
        </>
    );
};

export default ViewMyAccount;
