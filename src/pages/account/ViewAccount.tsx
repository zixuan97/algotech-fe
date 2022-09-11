import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Button,
    IconButton,
    Tooltip
} from '@mui/material';
import '../../styles/pages/accounts.scss';
import { ChevronLeft } from '@mui/icons-material';
import { getUserDetailsSvc } from 'src/services/account/accountService';
import asyncFetchCallback from 'src/services/asyncFetchCallback';
import { User } from 'src/models/types';

const ViewAccount = () => {
    let params = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    const [user, setUser] = useState<User>();
    const id = params.get("id");

    const handleEditButtonClick = () => {
        console.log("Incomplete");
    };

    const handleDeleteButtonClick = () => {
        console.log("Incomplete");
    };

    const handleDisableButtonClick = () => {
        console.log("Incomplete");
    };

    useEffect(() => {
        id && asyncFetchCallback(
            getUserDetailsSvc(id),
            (user: User) => {
                setUser(user);
            },
            () => {
                //handle error here
            }
        )
    }, []);

    (
        !user && (
            <div>
                Loading ...
            </div>
        )
    )

    return (
        <>
            <Tooltip title='Return to Accounts' enterDelay={300}>
                <IconButton size='large' onClick={() => navigate('/accounts')}>
                    <ChevronLeft />
                </IconButton>
            </Tooltip>

            <div className='center-div'>
                <Box className='center-box'>
                    <div className='header-content'>
                        <h1>View User ID: {params.get("id")} </h1>
                        <div className='button-group'>
                            <Button
                                variant='contained'
                                className='create-btn'
                                color='primary'
                                onClick={() => handleEditButtonClick()}
                            >
                                EDIT
                            </Button>
                            <Button
                                type='submit'
                                variant='contained'
                                className='create-btn'
                                color='primary'
                                onClick={() => handleDeleteButtonClick()}
                            >
                                DELETE
                            </Button>
                            <Button
                                type='submit'
                                variant='contained'
                                className='create-btn'
                                color='primary'
                                onClick={() => handleDisableButtonClick()}
                            >
                                DISABLE
                            </Button>
                        </div>
                    </div>

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
                                <Box className="display-box">
                                    <div>
                                        <h6>
                                            User ID
                                        </h6>
                                        <h4>
                                            {user?.id}
                                        </h4>
                                    </div>

                                    <div>
                                        <h6>
                                            Role
                                        </h6>
                                        <h4>
                                            {user?.role}
                                        </h4>
                                    </div>
                                </Box>

                                <Box className="display-box">
                                    <div>
                                        <h6>
                                            First Name
                                        </h6>
                                        <h4>
                                            {user?.firstName}
                                        </h4>
                                    </div>

                                    <div>
                                        <h6>
                                            Last Name
                                        </h6>
                                        <h4>
                                            {user?.lastName}
                                        </h4>
                                    </div>
                                </Box>

                                <Box className="display-box">
                                    <div>
                                        <h6>
                                            Email
                                        </h6>
                                        <h4>
                                            {user?.email}
                                        </h4>
                                    </div>

                                    <div>
                                        <h6>
                                            Password
                                        </h6>
                                        <h4>
                                            **********
                                        </h4>
                                    </div>
                                </Box>
                            </div>
                        </div>
                        <div className='view-button-group'>
                            <Button
                                type='submit'
                                variant='contained'
                                className='create-btn'
                                color='primary'
                                onClick={() => {
                                    navigate('/accounts');
                                }}
                            >
                                Back
                            </Button>
                        </div>
                    </Paper>
                </Box>
            </div>
        </>
    );
};

export default ViewAccount;
