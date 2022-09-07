import React from 'react';
import { Outlet } from 'react-router';
import Appbar from '../components/common/Appbar';
import Sidebar from '../components/common/Sidebar';

const Home = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <div>
      <Appbar toggleOpen={setOpen} />
      <Sidebar open={open} toggleOpen={setOpen} />
      <Outlet />
    </div>
  );
};

export default Home;
