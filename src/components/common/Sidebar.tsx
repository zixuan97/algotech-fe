import {
  AccountBox,
  Inventory,
  LocalGroceryStore,
  People,
  Receipt,
  LocalShipping,
  MenuBook
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
  disabled?: boolean;
};

type MenuOpen = {
  inventory: boolean;
  sales: boolean;
  order: boolean;
  procurement: boolean;
  delivery: boolean;
  customers: boolean;
  hr: boolean;
  accounts: boolean;
  catalogue: boolean;
};

const menuOpenDefaultState: MenuOpen = {
  inventory: false,
  sales: false,
  order: false,
  procurement: false,
  delivery: false,
  customers: false,
  hr: false,
  accounts: false,
  catalogue: false
};

const Sidebar = ({ sidebarWidth, disabled = false }: SidebarProps) => {
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
          <img src={logo} width={75} height={65} alt='' />
        </Toolbar>
        <Divider />
        <List>
          <NestedList
            title={'Inventory'}
            open={menuOpen.inventory}
            toggleOpen={(open) => toggleMenuOpen('inventory', open)}
            icon={<Inventory />}
            disabled={disabled}
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
            title={'Catalogue'}
            open={menuOpen.catalogue}
            toggleOpen={(open) => toggleMenuOpen('catalogue', open)}
            icon={<MenuBook />}
            disabled={disabled}
          >
            <ListItemLink
              primary='Product Catalogue'
              to='/inventory/dashboard'
            />
            <ListItemLink
              primary='Bundle Catalogue'
              to='/inventory/allProducts'
            />
          </NestedList>

          <NestedList
            title={'Sales'}
            open={menuOpen.sales}
            toggleOpen={(open) => toggleMenuOpen('sales', open)}
            icon={<LocalGroceryStore />}
            disabled={disabled}
          >
            <List component='div' disablePadding>
              <ListItemLink primary='Dashboard' to='/sales/dashboard' />
              <ListItemLink
                primary='Shop Performance'
                to='sales/shopPerformance'
              />
              <ListItemLink
                primary='Order Fulfillment'
                to='sales/allSalesOrders'
              />
              <ListItemLink primary='Bulk Orders' to='sales/allSalesOrders' />
            </List>
          </NestedList>

          <NestedList
            title={'Procurement'}
            open={menuOpen.procurement}
            toggleOpen={(open) => toggleMenuOpen('procurement', open)}
            icon={<Receipt />}
            disabled={disabled}
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
            disabled={disabled}
          >
            <ListItemLink
              primary='Delivery Assignment'
              to='/delivery/myDeliveryAssignment'
            />
            <ListItemLink
              primary='Manual Deliveries'
              to='/delivery/allManualDeliveries'
            />
            <ListItemLink
              primary='Shippit Deliveries'
              to='/delivery/allShippitDeliveries'
            />
          </NestedList>

          <NestedList
            icon={<People />}
            title={'Customers'}
            open={menuOpen.customers}
            toggleOpen={(open) => toggleMenuOpen('customers', open)}
            disabled={disabled}
          >
            <ListItemLink primary='All Customers' to='customer/allCustomers' />
            <ListItemLink
              primary='Newsletter Templates'
              to='customer/allNewsletterTemplates'
            />
            <ListItemLink
              primary='Scheduled Newsletters'
              to='customer/allScheduledNewsletters'
            />
            <ListItemLink
              primary='Sent Newsletters'
              to='customer/allSentNewsletters'
            />
          </NestedList>

          <ListItemLink icon={<AccountBox />} primary='HR' to='/hr' disabled />

          <RoleComponent allowedRoles={[UserRole.ADMIN]}>
            <NestedList
              title={'Accounts'}
              open={menuOpen.accounts}
              toggleOpen={(open) => toggleMenuOpen('accounts', open)}
              icon={<People />}
              disabled={disabled}
            >
              <ListItemLink primary='ERP Accounts' to='/accounts' />
              <ListItemLink primary='B2B Accounts' to='/accounts/business' />
            </NestedList>
          </RoleComponent>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
