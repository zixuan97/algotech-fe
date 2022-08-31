import React from 'react';
import Appbar from '../components/common/Appbar';
import Sidebar from '../components/common/Sidebar';

type HomeProps = {
    children?: React.ReactNode;
};

const Home = ({ children }: HomeProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    return (
        <div>
            <Appbar toggleOpen={setOpen} />
            <Sidebar open={open} toggleOpen={setOpen} />
            {children && children}
        </div>
    );
};

export default Home;
