import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Restricted from 'src/pages/Restricted';
import AuthContext from '../../context/auth/authContext';

type RoleRouteProps = {
  allowedRoles: string[];
};

const RoleRoute = ({ allowedRoles }: RoleRouteProps): JSX.Element => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  return allowedRoles.includes(user?.role ?? '') ? (
    <Outlet />
  ) : (
    // <Navigate to='/restricted' />
    <Restricted />
  );
};

export default RoleRoute;
