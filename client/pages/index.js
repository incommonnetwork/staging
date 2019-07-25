import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Hero, { SideKick } from '../layouts/hero';

import Tile from 'react-bulma-components/src/components/tile';
import Card from 'react-bulma-components/src/components/card';
import Title from '../components/title';
import Spark from '../components/spark';

const HeroCard = ({ children }) => (
    <Card style={{
        backgroundColor: '#2f28289c',
        margin: '6rem',
        padding: '.5rem'
    }} >
        {children}
    </Card>
);

HeroCard.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
}

const Index = () => (
    <Fragment>
        <Hero title="InCommon" subtitle="Dinner parties for the Digital Age" textColor="white" image={'/static/main-background.jpg'} >
            <Tile kind="parent">
                <Tile kind="child" renderAs="article" >
                    <HeroCard>
                        <Title size={3} title="For People" color="white" />
                        <Spark url="https://spark.adobe.com/video/NnfAON46L5sTa/embed" />
                    </HeroCard>
                </Tile>
                <Tile kind="child" renderAs="article">
                    <HeroCard>
                        <Title size={3} title="For Events" color="white" />
                        <Spark url="https://spark.adobe.com/video/gwkQg1WKcpTqW/embed" />
                    </HeroCard>
                </Tile>
                <Tile kind="child" renderAs="article" >
                    <HeroCard>
                        <Title size={3} title="For Venues" color="white" />
                    </HeroCard>
                </Tile>
            </Tile>
        </Hero>
        <SideKick image={'/static/Placeholder.png'} />
    </Fragment>
);

export default Index;