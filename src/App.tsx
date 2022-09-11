import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AuthRoute from './components/auth/AuthRoute';
import AuthState from './context/auth/AuthState';
import Login from './pages/Login';
import CreateProduct from './pages/inventory/CreateProduct';
import { setAuthToken } from './utils/authUtils';
import Home from './pages/Home';
import ViewProduct from './pages/inventory/ViewProduct';
import ViewAllProducts from './pages/inventory/ViewAllProducts';
import Inventory from './pages/Inventory';
import Accounts from './pages/account/Accounts';
import ViewAccount from './pages/account/ViewAccount';
import CreateNewUser from './pages/account/CreateNewUser';

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
              <Route path='inventory' element={<Inventory />}></Route>
              <Route
                path='inventory/createProduct'
                element={<CreateProduct />}
              />
              <Route path='inventory/viewProduct' element={<ViewProduct />} />
              <Route path='inventory/products' element={<ViewAllProducts />} />

              <Route path='accounts' element={<Accounts />} />
              <Route path='accounts/viewAccount' element={<ViewAccount />} />
              <Route path='accounts/createNewUser' element={<CreateNewUser />} />
            </Route>
          </Routes>
        </Router>
      </AuthState>
    </ThemeProvider>
  );
};

export default App;
