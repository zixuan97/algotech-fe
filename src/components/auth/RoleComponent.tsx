import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Restricted from 'src/pages/Restricted';
import AuthContext from '../../context/auth/authContext';

type RoleComponentProps = {
  allowedRoles: string[];
  children: JSX.Element;
};

const RoleComponent = ({
  allowedRoles,
  children
}: RoleComponentProps): JSX.Element | null => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  return allowedRoles.includes(user?.role ?? '') ? children : null;
};

export default RoleComponent;
