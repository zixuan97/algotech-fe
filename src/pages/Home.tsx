import React from 'react';
import { Outlet } from 'react-router';
import authContext from 'src/context/auth/authContext';
import Appbar from '../components/common/Appbar';
import Sidebar from '../components/common/Sidebar';

const sidebarWidth = '15%';

type HomeProps = {
  disabled?: boolean;
  children?: JSX.Element;
};

const Home = ({ children }: HomeProps) => {
  const { user } = React.useContext(authContext);

  const disabled = !user?.isVerified;

  return (
    <div style={{ width: '100%' }}>
      <Appbar sidebarWidth={sidebarWidth} />
      <Sidebar sidebarWidth={sidebarWidth} disabled={disabled} />
      <div
        style={{
          width: `calc(100% - ${sidebarWidth})`,
          boxSizing: 'border-box',
          margin: `64px 0 0 ${sidebarWidth}`,
          padding: '0 1em'
        }}
      >
        <Outlet />
        {children && children}
      </div>
    </div>
  );
};

export default Home;
