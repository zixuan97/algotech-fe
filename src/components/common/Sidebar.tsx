import {
  AccountBox,
  Inventory,
  LocalGroceryStore,
  People,
  Receipt,
  LocalShipping,
  FamilyRestroomRounded
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

type MenuOpen = {
  inventory: boolean;
  sales: boolean;
  procurement: boolean;
  delivery: boolean;
  customers: boolean;
  hr: boolean;
};

const menuOpenDefaultState: MenuOpen = {
  inventory: false,
  sales: false,
  procurement: false,
  delivery: false,
  customers: false,
  hr: false
};

const submenuTypographyProps = { fontSize: '0.8em' };

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
            open={menuOpen.procurement}
            toggleOpen={(open) => toggleMenuOpen('procurement', open)}
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
            open={menuOpen.delivery}
            toggleOpen={(open) => toggleMenuOpen('delivery', open)}
            icon={<LocalShipping />}
          >
            <ListItemLink
              primary='Dashboard'
              to=''
              typographyProps={submenuTypographyProps}
            />
            <ListItemLink
              primary='All Deliveries'
              to='/delivery/allDeliveries'
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
