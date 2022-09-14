import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Paper,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    Grid,

} from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft } from '@mui/icons-material';
import asyncFetchCallback from '../../../src/services/util/asyncFetchCallback';
import { User } from 'src/models/types';
import { roles } from 'src/components/account/accountTypes';
import BottomButton from 'src/components/common/BottomButton';
import { editUserSvc } from 'src/services/accountService';
import { toast } from 'react-toastify';

const EditAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleSaveButtonClick = (e: any) => {
        e.preventDefault();
        asyncFetchCallback(
            editUserSvc(currentUser),
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
                navigate(`/accounts/viewAccount?id=${currentUser.id}`);
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
    const user = location.state as User;
    const [currentUser, setCurrentUser] = useState<User>(user);

    const userFieldOnChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        key: string
    ) => {
        setCurrentUser((user: User) => {
            return {
                ...user,
                [key]: event.target.value
            };
        });
    };

    return (
        <>
            <Tooltip title='Return to Accounts' enterDelay={300}>
                <IconButton size='large' onClick={() => navigate(`/accounts/viewAccount?id=${currentUser.id}`)}>
                    <ChevronLeft />
                </IconButton>
            </Tooltip>

            <div className='center-div'>
                <Box className='center-box'>
                    <h1>Edit Account</h1>
                    <Paper elevation={2}>
                        <form>
                            <div className='content-body'>
                                <div className='right-content'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                required
                                                id='outlined-quantity'
                                                label='First Name'
                                                name='firstName'
                                                placeholder='eg.: John'
                                                value={currentUser?.first_name}
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
                                                value={currentUser?.last_name}
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
                                                value={currentUser?.email}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    userFieldOnChange(e, 'email')
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id='outlined-field'
                                                select
                                                label='Role'
                                                value={currentUser?.role}
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
                                    </Grid>
                                </div>
                            </div>
                            <BottomButton
                                location={`accounts/viewAccount?id=${user.id}`}
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

export default EditAccount;
