import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    Grid,
    InputAdornment,
    OutlinedInput,

} from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft, Visibility, VisibilityOff } from '@mui/icons-material';
import asyncFetchCallback from 'src/services/asyncFetchCallback';
import { User } from 'src/models/types';
import { roles } from 'src/components/account/accountTypes';
import BottomButton from 'src/components/common/BottomButton';
import { createUserSvc } from 'src/services/account/accountService';


const CreateNewUser = () => {
    const mockUser: User = {
        email: '',
        role: '',
        status: '',
        firstName: '',
        lastName: '',
        password: ''
    }

    const navigate = useNavigate();
    const handleCreateButtonClick = () => {
        asyncFetchCallback(
            createUserSvc(newUser),
            () => {},
            () => {
                //handle error here
            }
        )    

        return console.log("Incomplete, to add CreateUser::Function");
    };
    const [showPassword, setShowPassword] = useState<Boolean>(false);
    const [newUser, setNewUser] = useState<User>(mockUser);

    const userFieldOnChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setNewUser(
            (user: User) => {
                return {
                    ...user, [key]: event.target.value
                }
            }
        )
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
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
                    <h1>Create New User Account</h1>
                    <Paper elevation={2}>
                        <div className="content-body">
                            <div className="left-image">
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
                            </div>

                            <div className="right-content">
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            disabled
                                            fullWidth
                                            id='outlined-quantity'
                                            label='User ID'
                                            name='userId'
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
                                            value={newUser?.role}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => userFieldOnChange(e, "role")}
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
                                            id='outlined-quantity'
                                            label='First Name'
                                            name='firstName'
                                            placeholder='eg.: John'
                                            value={newUser?.firstName}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => userFieldOnChange(e, "firstName")}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            id='outlined-quantity'
                                            label='Last Name'
                                            name='lastName'
                                            placeholder='eg.: Tan'
                                            value={newUser?.lastName}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => userFieldOnChange(e, "lastName")}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            id='outlined-quantity'
                                            label='Email'
                                            name='email'
                                            placeholder='eg.: johntan@gmail.com'
                                            value={newUser?.email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => userFieldOnChange(e, "email")}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <OutlinedInput
                                            fullWidth
                                            type={showPassword ? 'text' : 'password'}
                                            id='outlined-quantity'
                                            label='Password'
                                            name='password'
                                            value={newUser?.password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => userFieldOnChange(e, "password")}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                        <BottomButton 
                            location='accounts' 
                            firstButtonText='CANCEL'
                            secondButtonText='CREATE ACCOUNT'
                            secondButtonFn={handleCreateButtonClick} />
                    </Paper>
                </Box>
            </div>
        </>
    );
};

export default CreateNewUser;