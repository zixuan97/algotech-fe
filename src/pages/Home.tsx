import React from 'react';
import { Outlet } from 'react-router';
import Appbar from '../components/common/Appbar';
import Sidebar from '../components/common/Sidebar';

const sidebarWidth = '15%';

const Home = () => {
  return (
    <div style={{ width: '100%' }}>
      <Appbar sidebarWidth={sidebarWidth} />
      <Sidebar sidebarWidth={sidebarWidth} />
      <div
        style={{
          width: `calc(100% - ${sidebarWidth})`,
          boxSizing: 'border-box',
          marginLeft: sidebarWidth,
          padding: '0 1em'
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
