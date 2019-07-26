import React, { Component } from 'react';

import Navbar from 'react-bulma-components/src/components/navbar';

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
                fixed={'top'}
                active={this.state.open}
            >
                <Navbar.Brand>
                    <Navbar.Item renderAs="a" href="#">
                        InCommon
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
            </Navbar>
        );
    }
}
export default Header;