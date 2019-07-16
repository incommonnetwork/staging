import React from 'react';

import Navbar from 'react-bulma-components/src/components/navbar';

import Link from './link';
import Auth from './auth';

const Header = () => (
    <Navbar color='primary'>

        <Navbar.Brand>
            <Navbar.Item>
                <Link href='/about' id='nav_about'>
                    InCommon
                </Link>
            </Navbar.Item>

        </Navbar.Brand>

        <Navbar.Container
            position="end">

            <Navbar.Item>
                <Link href='/' id='nav_'>
                    Enter Code
                </Link>
            </Navbar.Item>
            <Auth />
        </Navbar.Container>

    </Navbar>
);

export default Header;