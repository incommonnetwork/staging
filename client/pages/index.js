import React, { Fragment } from 'react';

import Hero, { SideKick, HeroTile } from '../layouts/hero';

const Index = () => (
    <Fragment>
        <Hero title="InCommon" subtitle="Dinner parties for the Digital Age" textColor="white" image={'/static/main-background.jpg'} >
            <HeroTile
                title="For People"
                subtitle="Inviting you back into the real world."
                sidekick="people"
            />
            <HeroTile
                title="For Events"
                subtitle="The curtain closes, the conversation begins."
                sidekick="events"
            />
            <HeroTile
                title="For Restaurants"
                subtitle="Split the check, fill the table."
                sidekick="restaurants"
            />
        </Hero>
        <SideKick name="people" image={'/static/Placeholder.png'} />
        <SideKick name="events" justify="right" image={'/static/Placeholder.png'} />
        <SideKick name="restaurants" image={'/static/Placeholder.png'} />
    </Fragment >
);

export default Index;