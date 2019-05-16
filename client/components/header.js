import React, { Component } from 'react';

import Navbar from 'react-bulma-components/src/components/navbar';
import Button from 'react-bulma-components/src/components/button';

import Link from './link';

class Header extends Component {
    render() {
        return (
            <Navbar color='primary'>

                <Navbar.Brand>
                    <Link href='/'>
                        <Navbar.Item>
                            InCommon
                        </Navbar.Item>
                    </Link>
                </Navbar.Brand>

                <Navbar.Container position="end">
                    <Link href='/signup'>
                        <Navbar.Item>
                            <Button>
                                Sign Up
                            </Button>
                        </Navbar.Item>
                    </Link>
                </Navbar.Container>

            </Navbar>
        )
    }
}

export default Header