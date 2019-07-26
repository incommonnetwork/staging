/* global document */
import React, { Component } from 'react';

import Navbar from 'react-bulma-components/src/components/navbar';
import Link from './link';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            open: false
        };
    }

    render() {
        return (
            <Navbar
                color={'primary'}
                style={{
                    left: 0,
                    position: 'fixed',
                    right: 0,
                    zIndex: 30
                }}
                active={this.state.open}
            >
                <Navbar.Brand>
                    <Navbar.Item>
                        <div onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            const top = document.getElementById('top');
                            if (top) top.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }}>
                            <Link href="/">
                                InCommon
                            </Link>
                        </div>
                    </Navbar.Item>
                    <Navbar.Burger
                        active={`${this.state.open}`}
                        onClick={() => this.setState({
                            open: !this.state.open
                        })}
                    />
                </Navbar.Brand>
                <Navbar.Menu active={`${this.state.open}`}>
                    <Navbar.Container>
                        <Navbar.Item href="#">Second</Navbar.Item>
                    </Navbar.Container>
                    <Navbar.Container position="end">
                        <Navbar.Item href="#">At the end</Navbar.Item>
                    </Navbar.Container>
                </Navbar.Menu>
            </Navbar >
        );
    }
}
export default Header;