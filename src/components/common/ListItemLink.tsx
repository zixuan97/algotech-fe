import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps
} from 'react-router-dom';

type ListItemLinkProps = {
  icon?: React.ReactElement;
  primary: string;
  to: string;
  disabled?: boolean;
};

const ListItemLink = ({
  icon,
  primary,
  to,
  disabled = false
}: ListItemLinkProps) => {
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(
        (itemProps, ref) => {
          return (
            <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />
          );
        }
      ),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink} disabled={disabled}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
};

export default ListItemLink;
