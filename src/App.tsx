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
            </Route>
          </Routes>
        </Router>
      </AuthState>
    </ThemeProvider>
  );
};

export default App;
