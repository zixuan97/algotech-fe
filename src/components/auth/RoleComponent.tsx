import { useContext } from 'react';
import { UserRole } from 'src/models/types';
import AuthContext from '../../context/auth/authContext';

type RoleComponentProps = {
  allowedRoles: UserRole[];
  children: JSX.Element;
};

const RoleComponent = ({
  allowedRoles,
  children
}: RoleComponentProps): JSX.Element | null => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  return user && allowedRoles.includes(user.role) ? children : null;
};

export default RoleComponent;
