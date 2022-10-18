import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AuthRoute from './components/routing/AuthRoute';
import AuthState from './context/auth/AuthState';
import Login from './pages/Login';
import CreateProduct from './pages/inventory/CreateProduct';
import { setAuthToken } from './utils/authUtils';
import Home from './pages/Home';

import ProductDetails from './pages/inventory/ProductDetails';
import AllProducts from './pages/inventory/AllProducts';
import InventoryDashboard from './pages/inventory/InventoryDashboard';

import AllBundles from './pages/inventory/AllBundles';
import CreateBundle from './pages/inventory/CreateBundle';
import BundleDetails from './pages/inventory/BundleDetails';

import AllBrands from './pages/inventory/AllBrands';
import CreateBrand from './pages/inventory/CreateBrand';
import BrandDetails from './pages/inventory/BrandDetails';

import AllWarehouses from './pages/inventory/Warehouses';
import WarehouseDetails from './pages/inventory/WarehouseDetails';
import CreateWarehouse from './pages/inventory/CreateWarehouse';

import AllCatalogueProducts from './pages/catalogue/AllCatalogueProducts';
import CatalogueProductDetails from './pages/catalogue/CatalogueProductDetails';
import CreateCatalogueProduct from './pages/catalogue/CreateCatalogueProduct';

import AllCatalogueBundles from './pages/catalogue/AllCatalogueBundles';
import CatalogueBundleDetails from './pages/catalogue/CatalogueBundleDetails';
import CreateCatalogueBundle from './pages/catalogue/CreateCatalogueBundle';

import AllProcurementOrders from './pages/procurement/AllProcurementOrders';
import CreateProcurementOrder from './pages/procurement/CreateProcurementOrder';
import ProcurementOrderDetails from './pages/procurement/ProcurementOrderDetails';

import AllSuppliers from './pages/procurement/AllSuppliers';
import SupplierDetails from './pages/procurement/SupplierDetails';
import CreateSupplier from './pages/procurement/CreateSupplier';

import AllManualDeliveries from './pages/delivery/AllManualDeliveries';
import AllShippitDeliveries from './pages/delivery/AllShippitDeliveries';
import CreateDeliveryOrder from './pages/delivery/CreateDelivery';
import ManualDeliveryDetails from './pages/delivery/ManualDeliveryDetails';
import MyDeliveryAssignment from './pages/delivery/MyDeliveryAssignment';
import ShippitDeliveryDetails from './pages/delivery/ShippitDeliveryDetails';

import AllCustomers from './pages/customers/AllCustomers';
import CustomerDetails from './pages/customers/CustomerDetails';
import AllSentNewsletters from './pages/customers/AllSentNewsletters';
import AllScheduledNewsletters from './pages/customers/AllScheduledNewsletters';
import AllNewsletterTemplates from './pages/customers/AllNewsletterTemplates';
import CreateNewsletterTemplate from './pages/customers/CreateNewsletterTemplate';
import ScheduleNewsletter from './pages/customers/ScheduleNewsletter';
import ViewNewsletterTemplate from './pages/customers/ViewNewsletterTemplate';
import ViewScheduledNewsletter from './pages/customers/ViewScheduledNewsletter';

import Accounts from './pages/account/Accounts';
import ViewAccount from './pages/account/ViewAccount';
import CreateNewUser from './pages/account/CreateNewUser';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewMyAccount from './pages/account/ViewMyAccount';
import AllCategories from './pages/inventory/AllCategories';
import CreateCategory from './pages/inventory/CreateCategory';
import CategoryDetails from './pages/inventory/CategoryDetails';
import RoleRoute from './components/routing/RoleRoute';
import Restricted from './pages/Restricted';
import InventoryState from './context/inventory/InventoryState';
import SalesDashboard from './pages/sales/SalesDashboard';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import AllSalesOrder from './pages/sales/AllSalesOrders';
import SalesOrderDetails from './pages/sales/SalesOrderDetails';
import NotFound from './pages/NotFound';
import ShopPerformance from './pages/sales/ShopPerformance';
import ViewBusinessAccount from './pages/account/ViewBusinessAccount';
import BusinessAccounts from './pages/account/BusinessAccounts';
import AllBulkOrders from './pages/sales/bulkOrders/AllBulkOrders';
import BulkOrderDetails from './pages/sales/bulkOrders/BulkOrderDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F1646'
    },
    secondary: {
      main: '#96694C'
    }
  },
  typography: {
    allVariants: {
      fontFamily: 'Poppins',
      textTransform: 'none',
      fontSize: 14
    }
  }
});

const App = () => {
  const token = localStorage.token;
  React.useEffect(() => {
    setAuthToken(localStorage.token);
  }, [token]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <AuthState>
          <InventoryState>
            <ToastContainer />
            <Router>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route
                  path='accounts/viewMyAccount'
                  element={
                    <AuthRoute unauthRedirect='/login'>
                      <Home>
                        <ViewMyAccount />
                      </Home>
                    </AuthRoute>
                  }
                />

                <Route
                  path='/'
                  element={
                    <AuthRoute
                      unauthRedirect='/login'
                      unverifiedRedirect='/accounts/viewMyAccount'
                    >
                      <Home />
                    </AuthRoute>
                  }
                >
                  <Route path='restricted' element={<Restricted />} />

                  {/* --- Inventory Routes --- */}
                  <Route
                    index
                    element={<Navigate replace to='/inventory/dashboard' />}
                  />
                  <Route
                    path='inventory'
                    element={<Navigate replace to='/inventory/dashboard' />}
                  />
                  <Route
                    path='inventory/dashboard'
                    element={<InventoryDashboard />}
                  />
                  <Route
                    path='inventory/allProducts'
                    element={<AllProducts />}
                  />
                  <Route
                    path='inventory/createProduct'
                    element={<CreateProduct />}
                  />
                  <Route path='inventory/allBundles' element={<AllBundles />} />
                  <Route
                    path='inventory/createBundle'
                    element={<CreateBundle />}
                  />
                  <Route
                    path='inventory/bundleDetails'
                    element={<BundleDetails />}
                  />
                  <Route
                    path='inventory/productDetails'
                    element={<ProductDetails />}
                  />
                  <Route
                    path='inventory/allCategories'
                    element={<AllCategories />}
                  />
                  <Route
                    path='inventory/createCategory'
                    element={<CreateCategory />}
                  />
                  <Route
                    path='inventory/categoryDetails'
                    element={<CategoryDetails />}
                  />
                  <Route path='inventory/allBrands' element={<AllBrands />} />
                  <Route
                    path='inventory/createBrand'
                    element={<CreateBrand />}
                  />
                  <Route
                    path='inventory/brandDetails'
                    element={<BrandDetails />}
                  />
                  <Route
                    path='inventory/warehouses'
                    element={<AllWarehouses />}
                  />
                  <Route
                    path='inventory/warehouseDetails'
                    element={<WarehouseDetails />}
                  />
                  <Route
                    path='inventory/createWarehouse'
                    element={<CreateWarehouse />}
                  />

                  {/* --- (B2B) Catalogue --- */}

                  <Route
                    path='catalogue/allCatalogueProducts'
                    element={<AllCatalogueProducts />}
                  />
                  <Route
                    path='catalogue/catalogueProductDetails'
                    element={<CatalogueProductDetails />}
                  />
                  <Route
                    path='catalogue/createCatalogueProduct'
                    element={<CreateCatalogueProduct />}
                  />

                  <Route
                    path='catalogue/allCatalogueBundles'
                    element={<AllCatalogueBundles />}
                  />
                  <Route
                    path='catalogue/catalogueBundleDetails'
                    element={<CatalogueBundleDetails />}
                  />
                  <Route
                    path='catalogue/createCatalogueBundle'
                    element={<CreateCatalogueBundle />}
                  />

                  {/* --- Delivery Routes --- */}
                  <Route
                    path='delivery/allManualDeliveries'
                    element={<AllManualDeliveries />}
                  />
                  <Route
                    path='delivery/createDelivery'
                    element={<CreateDeliveryOrder />}
                  />
                  <Route
                    path='delivery/allShippitDeliveries'
                    element={<AllShippitDeliveries />}
                  />
                  <Route
                    path='delivery/manualDeliveryDetails'
                    element={<ManualDeliveryDetails />}
                  />
                  <Route
                    path='delivery/shippitDeliveryDetails'
                    element={<ShippitDeliveryDetails />}
                  />
                  <Route
                    path='delivery/myDeliveryAssignment'
                    element={<MyDeliveryAssignment />}
                  />

                  {/* --- Customers Routes --- */}
                  <Route
                    path='customer/allCustomers'
                    element={<AllCustomers />}
                  />
                  <Route
                    path='customer/customerDetails'
                    element={<CustomerDetails />}
                  />
                  <Route
                    path='customer/allSentNewsletters'
                    element={<AllSentNewsletters />}
                  />
                  <Route
                    path='customer/allScheduledNewsletters'
                    element={<AllScheduledNewsletters />}
                  />
                  <Route
                    path='customer/allNewsletterTemplates'
                    element={<AllNewsletterTemplates />}
                  />
                  <Route
                    path='customer/createNewsletterTemplate'
                    element={<CreateNewsletterTemplate />}
                  />
                  <Route
                    path='customer/scheduleNewsletter'
                    element={<ScheduleNewsletter />}
                  />
                  <Route
                    path='customer/viewNewsletterTemplate'
                    element={<ViewNewsletterTemplate />}
                  />
                  <Route
                    path='customer/viewScheduledNewsletter'
                    element={<ViewScheduledNewsletter />}
                  />

                  {/* --- Sales Routes --- */}
                  <Route
                    index
                    element={<Navigate replace to='/sales/dashboard' />}
                  />
                  <Route
                    path='sales'
                    element={<Navigate replace to='/sales/dashboard' />}
                  />
                  <Route path='sales/dashboard' element={<SalesDashboard />} />
                  <Route
                    path='sales/createNewOrder'
                    element={<AllSalesOrder />}
                  />
                  <Route
                    path='sales/allSalesOrders'
                    element={<AllSalesOrder />}
                  />
                  <Route
                    path='sales/salesOrderDetails'
                    element={<SalesOrderDetails />}
                  />
                  <Route
                    path='sales/shopPerformance'
                    element={<ShopPerformance />}
                  />
                  <Route
                    path='sales/allBulkOrders'
                    element={<AllBulkOrders />}
                  />
                  <Route
                    path='sales/bulkOrderDetails'
                    element={<BulkOrderDetails />}
                  />

                  {/* --- Procurement Routes --- */}
                  <Route
                    path='procurementOrders'
                    element={<AllProcurementOrders />}
                  />
                  <Route
                    path='procurementOrders/createProcurementOrder'
                    element={<CreateProcurementOrder />}
                  />
                  <Route
                    path='procurementOrders/procurementOrderDetails'
                    element={<ProcurementOrderDetails />}
                  />
                  <Route
                    path='procurementOrders/allSuppliers'
                    element={<AllSuppliers />}
                  />
                  <Route
                    path='procurementOrders/createSupplier'
                    element={<CreateSupplier />}
                  />
                  <Route
                    path='procurementOrders/supplierDetails'
                    element={<SupplierDetails />}
                  />

                  {/* --- Account Routes --- */}
                  <Route
                    path='accounts'
                    element={<RoleRoute allowedRoles={['ADMIN']} />}
                  >
                    <Route index element={<Accounts />} />
                    <Route path='viewAccount' element={<ViewAccount />} />
                    <Route path='createNewUser' element={<CreateNewUser />} />
                    <Route path='business' element={<BusinessAccounts />} />
                    <Route
                      path='viewBusinessAccount'
                      element={<ViewBusinessAccount />}
                    />
                  </Route>
                  <Route path='*' element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
          </InventoryState>
        </AuthState>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
