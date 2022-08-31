import {
    AccountBox,
    ChevronLeft,
    Inbox,
    Inventory,
    LocalGroceryStore,
    Mail,
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
                <Typography variant='h6'>Admin Portal</Typography>
                <IconButton onClick={() => toggleOpen(false)}>
                    <ChevronLeft />
                </IconButton>
            </Toolbar>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Inventory />
                        </ListItemIcon>
                        <ListItemText primary='Inventory' />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <LocalGroceryStore />
                        </ListItemIcon>
                        <ListItemText primary='Sales' />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Receipt />
                        </ListItemIcon>
                        <ListItemText primary='Orders' />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <People />
                        </ListItemIcon>
                        <ListItemText primary='Customers' />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountBox />
                        </ListItemIcon>
                        <ListItemText primary='HR' />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
