import React from 'react';

import Hero from '../layouts/hero';

import Tile from 'react-bulma-components/src/components/tile';
import Title from '../components/title';
import Spark from '../components/spark';

const Index = () => (
    <Hero title="InCommon" subtitle="Dinner parties for the Digital Age" >
        <Tile kind="parent">
            <Tile kind="child" renderAs="article" notification color="primary">
                <Title size={3} title="For People" />
                <Spark url="https://spark.adobe.com/video/NnfAON46L5sTa/embed" />
            </Tile>
            <Tile kind="child" renderAs="article" notification color="info">
                <Title size={3} title="For Events" />
                <Spark url="https://spark.adobe.com/video/gwkQg1WKcpTqW/embed" />
            </Tile>
            <Tile kind="child" renderAs="article" notification color="info">
                <Title size={3} title="For Venues" />
            </Tile>
        </Tile>
    </Hero>
);

export default Index;