import React, { Component } from 'react';

import Navbar from 'react-bulma-components/src/components/navbar';

import Link from './link';
import Auth from './auth';

export default () => (
    <Navbar color='primary'>

        <Navbar.Brand>
            <Link href='/'>
                <Navbar.Item id='nav_'>
                    InCommon
                </Navbar.Item>
            </Link>
        </Navbar.Brand>

        <Navbar.Container position="end">

        </Navbar.Container>

    </Navbar>
);