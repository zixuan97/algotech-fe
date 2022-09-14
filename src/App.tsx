import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AuthRoute from './components/auth/AuthRoute';
import AuthState from './context/auth/AuthState';
import Login from './pages/Login';
import CreateProduct from './pages/inventory/CreateProduct';
import { setAuthToken } from './utils/authUtils';
import Home from './pages/Home';

import ProductDetails from './pages/inventory/ProductDetails';
import AllProducts from './pages/inventory/AllProducts';
import InventoryDashboard from './pages/inventory/InventoryDashboard';

import AllCategories from './pages/inventory/AllCategories';
import CreateCategory from './pages/inventory/CreateCategory';
import CategoryDetails from './pages/inventory/CategoryDetails';

import AllBrands from './pages/inventory/AllBrands';
import CreateBrand from './pages/inventory/CreateBrand';
import BrandDetails from './pages/inventory/BrandDetails';

import AllWarehouses from './pages/inventory/Warehouses';
import WarehouseDetails from './pages/inventory/WarehouseDetails';
import CreateWarehouse from './pages/inventory/CreateWarehouse';

import AllOrders from './pages/procurement/AllProcurementOrders';
import CreateProcurementOrder from './pages/procurement/CreateProcurementOrder';
import ProcurementOrderDetails from './pages/procurement/ProcurementOrderDetails';
import Accounts from './pages/account/Accounts';
import ViewAccount from './pages/account/ViewAccount';
import CreateNewUser from './pages/account/CreateNewUser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditAccount from './pages/account/EditAccount';
import ViewMyAccount from './pages/account/ViewMyAccount';

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

// if (localStorage.token) {
//     setAuthToken(localStorage.token);
// }

const App = () => {
  const token = localStorage.token;
  React.useEffect(() => {
    setAuthToken(localStorage.token);
  }, [token]);
  return (
    <ThemeProvider theme={theme}>
      <AuthState>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route
              path='/'
              element={
                <AuthRoute redirectTo='/login'>
                  <Home />
                </AuthRoute>
              }
            >
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
              <Route path='inventory/allProducts' element={<AllProducts />} />
              <Route
                path='inventory/createProduct'
                element={<CreateProduct />}
              />
              <Route
                path='inventory/productDetails'
                element={<ProductDetails />}
              />
              <Route path='orders' element={<AllOrders />} />
              <Route
                path='orders/createProcurementOrder'
                element={<CreateProcurementOrder />}
              />
              <Route
                path='orders/procurementOrderDetails'
                element={<ProcurementOrderDetails />}
              />
              {/* <Route
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
              <Route
                path='inventory/allBrands'
                element={<AllBrands />}
              />
              <Route
                path='inventory/createBrand'
                element={<CreateBrand />}
              />
              <Route
                path='inventory/brandDetails'
                element={<BrandDetails />}
              />
              <Route path='inventory/warehouses' element={<AllWarehouses />} />
              <Route
                path='inventory/warehouseDetails'
                element={<WarehouseDetails />}
              />
              <Route
                path='inventory/createWarehouse'
                element={<CreateWarehouse />}
              />

              <Route path='accounts' element={<Accounts />} />
              <Route path='accounts/viewAccount' element={<ViewAccount />} />
              <Route path='accounts/editAccount' element={<EditAccount />} />
              <Route
                path='accounts/createNewUser'
                element={<CreateNewUser />}
              />
              <Route path='accounts/viewMyAccount' element={<ViewMyAccount />} />
            </Route>
          </Routes>
        </Router>
      </AuthState>
    </ThemeProvider>
  );
};

export default App;
