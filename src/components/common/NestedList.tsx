import { ExpandLess, ExpandMore, FiberManualRecord } from '@mui/icons-material';
import {
  Chip,
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
  numRequest?: number;
};

const NestedList = ({
  title,
  icon,
  open,
  toggleOpen,
  children,
  disabled = false,
  numRequest
}: NestedListProps) => {
  return (
    <>
      <ListItem button disabled={disabled} onClick={() => toggleOpen(!open)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={title}
          primaryTypographyProps={{ fontWeight: 500 }}
        />
        {numRequest! > 0 && (
          <FiberManualRecord style={{fontSize: '15px', color: '#96694C'}} />
        )}
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
