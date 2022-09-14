import React from 'react';
import AppBar from '@mui/material/AppBar';
import { IconButton, Menu, MenuItem, Toolbar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import AuthContext from 'src/context/auth/authContext';
import { useNavigate } from 'react-router-dom';

type AppbarProps = {
  sidebarWidth: string;
};

const Appbar = ({ sidebarWidth }: AppbarProps) => {
  const authContext = React.useContext(AuthContext);
  const navigate = useNavigate();
  const { logout, user } = authContext;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleViewProfile = () => {
    handleClose();
    navigate(`accounts/viewMyAccount?id=${user?.id}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position='fixed'
      sx={{ width: `calc(100% - ${sidebarWidth})`, ml: sidebarWidth }}
    >
      <Toolbar style={{ justifyContent: 'flex-end' }}>
        {/* <IconButton
          size='medium'
          edge='start'
          color='inherit'
          aria-label='menu'
          onClick={() => toggleOpen(true)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}

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
            <MenuItem onClick={handleViewProfile}>My Account</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
