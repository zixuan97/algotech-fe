import {
  AccountBox,
  ChevronLeft,
  Inventory,
  LocalGroceryStore,
  People,
  Receipt
} from '@mui/icons-material';
import {
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';
import React from 'react';

type SidebarProps = {
    open: boolean;
    toggleOpen: (open: boolean) => void;
};

const Sidebar = ({ open, toggleOpen }: SidebarProps) => {
  return (
    <Drawer variant='persistent' anchor='left' open={open}>
      <Toolbar>
        <Button
          variant='text'
          component={Link}
          to='/'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Admin Portal
        </Button>
        <IconButton onClick={() => toggleOpen(false)}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        <ListItemLink
          icon={<Inventory />}
          primary='Inventory'
          to='/inventory'
        />
        <ListItemLink
          icon={<LocalGroceryStore />}
          primary='Sales'
          to='/sales'
          disabled
        />
        <ListItemLink
          icon={<Receipt />}
          primary='Orders'
          to='/orders'
          disabled
        />
        <ListItemLink
          icon={<People />}
          primary='Customers'
          to='/customers'
          disabled
        />
        <ListItemLink icon={<AccountBox />} primary='HR' to='/hr' disabled />
      </List>
    </Drawer>
  );
};

export default Sidebar;
