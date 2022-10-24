import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import React from 'react';

type NestedListProps = {
  title: string;
  icon: React.ReactElement;
  open: boolean;
  toggleOpen: (open: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
  suffix?: React.ReactNode;
};

const NestedList = ({
  title,
  icon,
  open,
  toggleOpen,
  children,
  disabled = false,
  suffix
}: NestedListProps) => {
  return (
    <>
      <ListItem button disabled={disabled} onClick={() => toggleOpen(!open)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={title}
          primaryTypographyProps={{ fontWeight: 500 }}
        />
        {suffix && suffix}
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit sx={{ pl: '0.5em' }}>
        <List component='div' disablePadding>
          {children}
        </List>
      </Collapse>
    </>
  );
};

export default NestedList;
