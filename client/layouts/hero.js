import React from 'react';
import PropTypes from 'prop-types';

import BulmaHero from 'react-bulma-components/src/components/hero';
import Container from 'react-bulma-components/src/components/container';
import Tile from 'react-bulma-components/src/components/tile';
import Image from 'react-bulma-components/src/components/image';

import Title from '../components/title';

const Hero = ({ title, subtitle, children }) => (
    <BulmaHero size="fullheight" color="info" gradient>
        <Tile vertical style={{ justifyContent: 'space-around' }}>
            <Container fluid>
                <Title size={1} title={title} subtitle={subtitle} />
            </Container>
            <Container fluid>
                {children}
            </Container>
        </Tile>
    </BulmaHero>
);

Hero.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

const SideKickImage = ({ src }) => (
    <Image style={{ flex: 'auto', alignSelf: 'center' }} size={'square'} src={src} />
)

SideKickImage.propTypes = {
    src: PropTypes.string.isRequired
}

const SideKick = ({ children, image, justify = 'left' }) => (
    <BulmaHero size="fullheight" color="info" gradient style={{ maxHeight: '100vh' }}>
        <Tile style={{ maxHeight: 'inherit', overflowY: 'hidden' }}>
            <Tile >
                {justify !== 'left' ? <SideKickImage src={image} /> : children}
            </Tile>
            <Tile>
                {justify === 'left' ? <SideKickImage src={image} /> : children}
            </Tile>
        </Tile>
    </BulmaHero>
);

SideKick.propTypes = {
    image: PropTypes.string.isRequired,
    justify: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
}

export { SideKick };

export default Hero;