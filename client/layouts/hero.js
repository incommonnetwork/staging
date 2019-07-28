/* global window, document */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BulmaHero from 'react-bulma-components/src/components/hero';
import BulmaContainer from 'react-bulma-components/src/components/container';
import Tile from 'react-bulma-components/src/components/tile';
import Navbar from 'react-bulma-components/src/components/navbar';

import Title from '../components/title';
import Button from '../components/button';
import Link from '../components/link';
import Container from '../layouts/container';
import ScrollArrow from '../components/scroll_arrow';

const Hero = ({ copy, children, textColor }) => (
    <div style={{ position: 'relative' }}>
        <BulmaHero size="fullheight" style={{
            backgroundImage: `url(${process.env.ASSET_PREFIX}${copy.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }}>
            <a id={'top'} />
            <Navbar color='primary' />
            <Tile vertical style={{ justifyContent: 'space-around' }}>
                <BulmaHero style={{ backgroundColor: 'rgba(0, 0, 0, 0.69)', padding: '2rem' }}>
                    <Title size={1} title={copy.title} subtitle={copy.subtitle} color={textColor} />
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                        <p style={{ maxWidth: '20rem', color: 'white' }}>
                            {copy.lede}
                        </p>
                    </div>
                    <BulmaContainer fluid>
                        <Tile kind="parent">
                            {children}
                        </Tile>
                    </BulmaContainer>
                </BulmaHero>
            </Tile>
        </BulmaHero >
        <ScrollArrow />
    </div>
);

Hero.propTypes = {
    copy: PropTypes.object.isRequired,
    textColor: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

const HeroTile = ({ copy, sidekick, textColor = 'white' }) => (
    <Tile kind="child" renderAs="article" style={{
        margin: '6rem',
        padding: '.5rem'
    }} >
        <Title size={3} title={copy.title} subtitle={copy.subtitle} color={textColor} />
        <br />
        <div style={{ textAlign: 'center' }}>
            <Button
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById(sidekick).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }}>Learn More</Button>
        </div>
    </Tile >
);

HeroTile.propTypes = {
    copy: PropTypes.object.isRequired,
    sidekick: PropTypes.string.isRequired,
    textColor: PropTypes.string
};



class SideKickImage extends Component {
    constructor() {
        super();
        this.state = {
            backgroundImage: 'none'
        };
    }

    componentDidMount() {
        if ((window.innerWidth || document.body.clientWidth) > 700) {
            this.setState({
                backgroundImage: `url(${process.env.ASSET_PREFIX}${this.props.src})`
            });
        }
    }

    render() {
        return (
            <Tile style={{
                backgroundImage: this.state.backgroundImage,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            }} />
        );
    }
}

SideKickImage.propTypes = {
    src: PropTypes.string.isRequired
};

const SideKick = ({ arrow, copy, justify = 'left', name, backgroundColor = 'white' }) => (
    <BulmaHero size="fullheight" style={{ backgroundColor, maxHeight: '100vh' }}>
        <a id={name} />
        <Navbar color='primary' style={{ backgroundColor: 'black' }} />
        <Tile >
            {justify !== 'left' ? <SideKickImage src={copy.image} /> : null}
            <Tile style={{
                minHeight: '100%',
                display: 'flex'
            }}>
                <div style={{ position: 'relative' }}>
                    <Container>
                        <Title title={copy.title} subtitle={copy.lede} />
                        <Link href={copy.href}>
                            <Button>
                                {copy.button}
                            </Button>
                        </Link>
                    </Container>
                    {arrow ? <ScrollArrow /> : null}
                </div>
            </Tile>
            {justify === 'left' ? <SideKickImage src={copy.image} /> : null}
        </Tile>
    </BulmaHero>
);

SideKick.propTypes = {
    copy: PropTypes.object.isRequired,
    arrow: PropTypes.bool,
    name: PropTypes.string.isRequired,
    justify: PropTypes.string,
    backgroundColor: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export { SideKick, HeroTile };

export default Hero;