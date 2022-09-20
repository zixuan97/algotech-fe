import {
  AccountBox,
  Inventory,
  LocalGroceryStore,
  People,
  Receipt,
  LocalShipping
} from '@mui/icons-material';
import { Button, Divider, Drawer, List, Toolbar } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import RoleComponent from '../auth/RoleComponent';
import ListItemLink from './ListItemLink';
import NestedList from './NestedList';

import logo from '../logo blue.png';

type SidebarProps = {
  sidebarWidth: string;
};

const Sidebar = ({ sidebarWidth }: SidebarProps) => {
  const [inventoryOpen, setInventoryOpen] = React.useState<boolean>(false);
  const [salesOpen, setSalesOpen] = React.useState<boolean>(false);
  const [ordersOpen, setOrdersOpen] = React.useState<boolean>(false);
  const [deliveryOpen, setDeliveryOpen] = React.useState<boolean>(false);
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
            The Kettle Gourmet{' '}
          </Button>
          <img src={logo} width={75} height={65} />
          {/* <IconButton onClick={() => toggleOpen(false)}>
            <ChevronLeft />
          </IconButton> */}
        </Toolbar>
        <Divider />
        <List>
          <NestedList
            title={'Inventory'}
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
                primary='Manage Brands'
                to='/inventory/allBrands'
                typographyProps={submenuTypographyProps}
              />
              <ListItemLink
                primary='Manage Categories'
                to='/inventory/allCategories'
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

          <NestedList
            title={'Procurement'}
            open={ordersOpen}
            toggleOpen={setOrdersOpen}
            icon={<Receipt />}
          >
            <ListItemLink
              primary='Orders'
              to='/orders'
              typographyProps={submenuTypographyProps}
            />
            <ListItemLink
              primary='All Suppliers'
              to='/orders/allSuppliers'
              typographyProps={submenuTypographyProps}
            />
          </NestedList>

          <NestedList
            title={'Delivery'}
            open={deliveryOpen}
            toggleOpen={setDeliveryOpen}
            icon={<LocalShipping />}
          >
            <ListItemLink
              primary='Manual Deliveries'
              to='/delivery/allManualDeliveries'
              typographyProps={submenuTypographyProps}
            />
            <ListItemLink
              primary='Grab Deliveries'
              to='/delivery/allGrabDeliveries'
              typographyProps={submenuTypographyProps}
            />
            <ListItemLink
              primary='Shippit Deliveries'
              to='/delivery/allShippitDeliveries'
              typographyProps={submenuTypographyProps}
            />
          </NestedList>

          <ListItemLink
            icon={<People />}
            primary='Customers'
            to='/customers'
            disabled
          />
          <ListItemLink icon={<AccountBox />} primary='HR' to='/hr' disabled />
          <RoleComponent allowedRoles={['ADMIN']}>
            <ListItemLink
              icon={<People />}
              primary='User Accounts'
              to='/accounts'
            />
          </RoleComponent>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
