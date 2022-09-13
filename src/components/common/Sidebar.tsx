import {
  AccountBox,
  ChevronLeft,
  Inventory,
  LocalGroceryStore,
  People,
  Receipt
} from '@mui/icons-material';
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import ListItemLink from './ListItemLink';
import NestedList from './NestedList';
import 'src/styles/pages/home.scss';

type SidebarProps = {
  sidebarWidth: string;
};

const Sidebar = ({ sidebarWidth }: SidebarProps) => {
  const [inventoryOpen, setInventoryOpen] = React.useState<boolean>(false);
  const [salesOpen, setSalesOpen] = React.useState<boolean>(false);
  const [ordersOpen, setOrdersOpen] = React.useState<boolean>(false);
  const [customersOpen, setCustomersOpen] = React.useState<boolean>(false);
  const [hrOpen, setHrOpen] = React.useState<boolean>(false);

  const submenuTypographyProps = { fontSize: '0.8em' };

  return (
    <div>
      <Drawer
        variant='permanent'
        anchor='left'
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar>
          <Button
            variant='text'
            component={Link}
            to='/'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Admin Portal
          </Button>
          {/* <IconButton onClick={() => toggleOpen(false)}>
            <ChevronLeft />
          </IconButton> */}
        </Toolbar>
        <Divider />
        <List>
          <NestedList
            open={inventoryOpen}
            toggleOpen={setInventoryOpen}
            icon={<Inventory />}
          >
            <List component='div' disablePadding>
              <ListItemLink
                primary='Dashboard'
                to='/inventory/dashboard'
                typographyProps={submenuTypographyProps}
              />
              <ListItemLink
                primary='All Products'
                to='/inventory/allProducts'
                typographyProps={submenuTypographyProps}
              />
              <ListItemLink
                primary='Manage Warehouses'
                to='/inventory/warehouses'
                typographyProps={submenuTypographyProps}
              />
            </List>
          </NestedList>
          <ListItemLink
            icon={<LocalGroceryStore />}
            primary='Sales'
            to='/sales'
            disabled
          />
          <ListItemLink icon={<Receipt />} primary='Orders' to='/orders' />
          <ListItemLink
            icon={<People />}
            primary='Customers'
            to='/customers'
            disabled
          />
          <ListItemLink icon={<AccountBox />} primary='HR' to='/hr' disabled />
          <ListItemLink
            icon={<People />}
            primary='User Accounts'
            to='/accounts'
          />
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
