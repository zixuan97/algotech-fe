import React from 'react';
import AppBar from '@mui/material/AppBar';
import { IconButton, Menu, MenuItem, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from '@mui/icons-material';
import AuthContext from 'src/context/auth/authContext';

type AppbarProps = {
    toggleOpen: (open: boolean) => void;
};

const Appbar = ({ toggleOpen }: AppbarProps) => {
    const authContext = React.useContext(AuthContext);
    const { logout } = authContext;

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position='static'>
            <Toolbar style={{ justifyContent: 'space-between' }}>
                <IconButton
                    size='medium'
                    edge='start'
                    color='inherit'
                    aria-label='menu'
                    onClick={() => toggleOpen(true)}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <div>
                    <IconButton
                        size='large'
                        aria-label='account of current user'
                        aria-controls='menu-appbar'
                        aria-haspopup='true'
                        onClick={handleMenu}
                        color='inherit'
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id='menu-appbar'
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        open={!!anchorEl}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Appbar;
