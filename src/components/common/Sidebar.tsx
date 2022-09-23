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
import { UserRole } from 'src/models/types';

type SidebarProps = {
  sidebarWidth: string;
};

type MenuOpen = {
  inventory: boolean;
  sales: boolean;
  order: boolean;
  procurement: boolean;
  delivery: boolean;
  customers: boolean;
  hr: boolean;
};

const menuOpenDefaultState: MenuOpen = {
  inventory: false,
  sales: false,
  order: false,
  procurement: false,
  delivery: false,
  customers: false,
  hr: false
};

const Sidebar = ({ sidebarWidth }: SidebarProps) => {
  const [menuOpen, setMenuOpen] =
    React.useState<MenuOpen>(menuOpenDefaultState);

  const toggleMenuOpen = (menu: keyof MenuOpen, open: boolean) => {
    setMenuOpen({ ...menuOpenDefaultState, [menu]: open });
  };

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
            open={menuOpen.inventory}
            toggleOpen={(open) => toggleMenuOpen('inventory', open)}
            icon={<Inventory />}
          >
            <ListItemLink primary='Dashboard' to='/inventory/dashboard' />
            <ListItemLink primary='All Products' to='/inventory/allProducts' />
            <ListItemLink primary='All Bundles' to='/inventory/allBundles' />
            <ListItemLink primary='Manage Brands' to='/inventory/allBrands' />
            <ListItemLink
              primary='Manage Categories'
              to='/inventory/allCategories'
            />
            <ListItemLink
              primary='Manage Warehouses'
              to='/inventory/warehouses'
            />
          </NestedList>

          <NestedList
            title={'Sales'}
            open={menuOpen.sales}
            toggleOpen={(open) => toggleMenuOpen('sales', open)}
            icon={<LocalGroceryStore />}
          >
            <List component='div' disablePadding>
              <ListItemLink primary='Dashboard' to='/sales/dashboard' />
              <ListItemLink
                primary='Create Orders'
                to='/orders/createNewOrder'
                disabled
              />
              <ListItemLink
                primary='Order Fulfillments'
                to='sales/allSalesOrders'
              />
            </List>
          </NestedList>

          <NestedList
            title={'Procurement'}
            open={menuOpen.procurement}
            toggleOpen={(open) => toggleMenuOpen('procurement', open)}
            icon={<Receipt />}
          >
            <ListItemLink
              primary='Procurement Orders'
              to='/procurementOrders'
            />
            <ListItemLink
              primary='All Suppliers'
              to='/procurementOrders/allSuppliers'
            />
          </NestedList>

          <NestedList
            title={'Delivery'}
            open={menuOpen.delivery}
            toggleOpen={(open) => toggleMenuOpen('delivery', open)}
            icon={<LocalShipping />}
          >
            <ListItemLink
              primary='Manual Deliveries'
              to='/delivery/allManualDeliveries'
            />
            <ListItemLink
              primary='Grab Deliveries'
              to='/delivery/allGrabDeliveries'
            />
            <ListItemLink
              primary='Shippit Deliveries'
              to='/delivery/allShippitDeliveries'
            />
          </NestedList>

          <ListItemLink
            icon={<People />}
            primary='Customers'
            to='/customers'
            disabled
          />
          <ListItemLink icon={<AccountBox />} primary='HR' to='/hr' disabled />
          <RoleComponent allowedRoles={[UserRole.ADMIN]}>
            <ListItemLink
              icon={<People />}
              primary='User Accounts'
              to='/accounts'
              typographyProps={{ fontWeight: 500 }}
            />
          </RoleComponent>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
