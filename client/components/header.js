import React from 'react';

import Navbar from 'react-bulma-components/src/components/navbar';

import Link from './link';
import Auth from './auth';

const Header = () => (
    <Navbar color='primary'>

        <Navbar.Brand>
            <Link href='/about' id='nav_'>
                <Navbar.Item>
                    InCommon
                </Navbar.Item>
            </Link>
        </Navbar.Brand>

        <Navbar.Container
            position="end">
            <Auth />
        </Navbar.Container>

    </Navbar>
);

export default Header;