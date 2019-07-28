import React, { Fragment } from 'react';

import Header from '../components/header';
import Hero, { SideKick } from '../layouts/hero';
import copy from '../copy/home';
import Title from '../components/title';
import Link from '../components/link'
import Button from '../components/button'

const Index = () => (
    <Fragment>
        <Header />
        <Hero
            copy={copy.hero}
            textColor="white"  >
        </Hero>
        <SideKick
            name={'people'}
            image={'/static/table-conversation.jpg'}
            arrow={true}
        >
            <Title
                title="For New Friends"
                size={2}
            />
            <div style={{ margin: '1rem' }} />
            <Title
                title="1"
                size={3}
                subtitle="Register your interests in the InCommon app"
            />
            <div style={{ margin: '1rem' }} />
            <Title
                title="2"
                size={3}
                subtitle="RSVP to meals that fit your schedule and budget"
            />
            <div style={{ margin: '1rem' }} />
            <Title
                title="3"
                size={3}
                subtitle="Tip your server"
            />
            <Link href='/sign_up?for=user'>
                <Button>
                    Join The Beta
                </Button>
            </Link>
        </SideKick>
        <SideKick
            name={'events'}
            image={'/static/stage.jpg'}
            arrow={true}
            justify={'right'}
        >
        </SideKick>
        <SideKick
            name={'restaurants'}
            image={'/static/reservation.jpg'}
            arrow={true}
        >
        </SideKick>
    </Fragment >
);

export default Index;