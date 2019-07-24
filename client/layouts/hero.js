import React from 'react';
import PropTypes from 'prop-types';

import BulmaHero from 'react-bulma-components/src/components/hero';
import Container from 'react-bulma-components/src/components/container';
import Tile from 'react-bulma-components/src/components/tile';

import Title from '../components/title';

const Hero = ({ title, subtitle, children }) => (
    <BulmaHero size="fullheight" color="primary" gradient>
        <Tile vertical style={{ justifyContent: 'space-around' }}>
            <BulmaHero size="medium">
                <Container fluid>
                    <Title size={1} title={title} subtitle={subtitle} />
                </Container>
            </BulmaHero>
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

export default Hero;