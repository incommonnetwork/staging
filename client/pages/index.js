import React, { Fragment } from 'react';

import Hero, { SideKick, HeroTile } from '../layouts/hero';
import lede from '../copy/lede';
import Header from '../components/header';

const Index = () => (
    <Fragment>
        <Header />
        <Hero title="InCommon" subtitle="Dinner parties for the Digital Age" lede={lede} textColor="white" image={'/static/main-background.jpg'}  >
            <HeroTile
                title="For People"
                subtitle="Get invited back into the real world."
                sidekick="people"
            />
            <HeroTile
                title="For Events"
                subtitle="Build community after the curtain closes."
                sidekick="events"
            />
            <HeroTile
                title="For Restaurants"
                subtitle="Split the check, fill the table."
                sidekick="restaurants"
            />
        </Hero>
        <SideKick title="For People" name="people" image={'/static/Placeholder.png'} />
        <SideKick name="events" justify="right" image={'/static/Placeholder.png'} />
        <SideKick name="restaurants" image={'/static/Placeholder.png'} />
    </Fragment >
);

export default Index;