import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AuthRoute from './components/auth/AuthRoute';
import AuthState from './context/auth/AuthState';
import Login from './pages/Login';
import CreateProduct from './pages/inventory/CreateProduct';
import { setAuthToken } from './utils/authUtils';
import Home from './pages/Home';
import Appbar from './components/common/Appbar';
import Sidebar from './components/common/Sidebar';

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
    const [open, setOpen] = React.useState<boolean>(false);
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
                    </Routes>

                    <Appbar toggleOpen={setOpen} />
                        <Sidebar open={open} toggleOpen={setOpen} />
                    <Routes>
                       
                        <Route
                            path='/'
                            element={
                                <AuthRoute redirectTo='/login'>
                                    <Home />
                                </AuthRoute>
                            }
                        />
                        <Route path='/createProduct' element={<CreateProduct />} />
                    </Routes>
                </Router>
            </AuthState>
        </ThemeProvider>
    );
};

export default App;
