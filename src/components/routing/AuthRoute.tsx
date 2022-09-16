import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

type AuthRouteProps = {
  children: JSX.Element;
  redirectTo: string;
};

const AuthRoute = ({ children, redirectTo }: AuthRouteProps): JSX.Element => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext;

  return isAuthenticated && user?.status==='ACTIVE'? children : <Navigate to={redirectTo} />;
};

export default AuthRoute;
