/* global document */
import React from 'react';
import PropTypes from 'prop-types';

import BulmaHero from 'react-bulma-components/src/components/hero';
import Container from 'react-bulma-components/src/components/container';
import Tile from 'react-bulma-components/src/components/tile';
import Image from 'react-bulma-components/src/components/image';
import Button from 'react-bulma-components/src/components/button';

import Title from '../components/title';

const Hero = ({ title, subtitle, children, image, textColor }) => (
    <BulmaHero size="fullheight" style={{
        backgroundImage: `url(${process.env.ASSET_PREFIX}${image})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    }}>
        <Tile vertical style={{ justifyContent: 'space-around' }}>
            <BulmaHero style={{ backgroundColor: '#2f28289c', paddingBottom: '2rem' }}>
                <Title size={1} title={title} subtitle={subtitle} color={textColor} />
            </BulmaHero>
            <Container fluid>
                <Tile kind="parent">
                    {children}
                </Tile>
            </Container>
        </Tile>
    </BulmaHero >
);

Hero.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    image: PropTypes.string,
    textColor: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

const HeroTile = ({ title, subtitle, sidekick, textColor = 'white' }) => (
    <Tile kind="child" renderAs="article" style={{
        backgroundColor: '#2f28289c',
        margin: '6rem',
        padding: '.5rem'
    }} >
        <Title size={3} title={title} subtitle={subtitle} color={textColor} />
        <br />
        <div style={{ textAlign: 'center' }}>
            <Button
                style={{
                    margin: '1rem',
                    backgroundColor: '#fffefeb0',
                    borderWidth: '2px'
                }}
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
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    sidekick: PropTypes.string.isRequired,
    textColor: PropTypes.string
};



const SideKickImage = ({ src }) => (
    <Image style={{ flex: 'auto', alignSelf: 'center' }} size={'square'} src={src} />
);

SideKickImage.propTypes = {
    src: PropTypes.string.isRequired
};

const SideKick = ({ children, image, justify = 'left', name }) => (
    <BulmaHero size="fullheight" color="info" gradient style={{ maxHeight: '100vh' }}>
        <a id={name} />
        <Tile style={{ maxHeight: 'inherit', overflowY: 'hidden' }}>
            <Tile >
                {justify !== 'left' ? <SideKickImage src={`${process.env.ASSET_PREFIX}${image}`} /> : children}
            </Tile>
            <Tile>
                {justify === 'left' ? <SideKickImage src={`${process.env.ASSET_PREFIX}${image}`} /> : children}
            </Tile>
        </Tile>
    </BulmaHero>
);

SideKick.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    justify: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export { SideKick, HeroTile };

export default Hero;