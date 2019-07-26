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
        <SideKick name="people" image={'/static/table-conversation.jpg'} />
        <SideKick name="events" justify="right" image={'/static/stage.jpg'} />
        <SideKick name="restaurants" image={'/static/reservation.jpg'} />
    </Fragment >
);

export default Index;