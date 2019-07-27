/* global document */
import React from 'react';
import PropTypes from 'prop-types';

import BulmaHero from 'react-bulma-components/src/components/hero';
import BulmaContainer from 'react-bulma-components/src/components/container';
import Tile from 'react-bulma-components/src/components/tile';
import Navbar from 'react-bulma-components/src/components/navbar';

import Title from '../components/title';
import Button from '../components/button';
import Link from '../components/link';
import Container from '../layouts/container';

const Hero = ({ copy, children, textColor }) => (
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



const SideKickImage = ({ src }) => (
    <Tile style={{
        backgroundImage: `url(${process.env.ASSET_PREFIX}${src})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    }} />
);

SideKickImage.propTypes = {
    src: PropTypes.string.isRequired
};

const SideKick = ({ copy, justify = 'left', name, backgroundColor = 'white' }) => (
    <BulmaHero size="fullheight" style={{ backgroundColor, maxHeight: '100vh' }}>
        <a id={name} />
        <Navbar color='primary' />
        <Tile >
            {justify !== 'left' ? <SideKickImage src={copy.image} /> : null}
            <Tile style={{
                minHeight: '100%',
                display: 'flex'
            }}>
                <Container>
                    <Title title={copy.title} subtitle={copy.lede} />
                    <Link href={copy.href}>
                        <Button>
                            {copy.button}
                        </Button>
                    </Link>
                </Container>
            </Tile>
            {justify === 'left' ? <SideKickImage src={copy.image} /> : null}
        </Tile>
    </BulmaHero>
);

SideKick.propTypes = {
    copy: PropTypes.object.isRequired,
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