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
};

const NestedList = ({
  title,
  icon,
  open,
  toggleOpen,
  children
}: NestedListProps) => {
  return (
    <>
      <ListItem button onClick={() => toggleOpen(!open)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={title}
          primaryTypographyProps={{ fontWeight: 500 }}
        />
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
