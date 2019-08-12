import React, { Fragment } from 'react';

import Header from '../components/header';
import Hero, { SideKick } from '../layouts/hero';
import copy from '../copy/home';
import Title from '../components/title';
import Link from '../components/link';
import Button from '../components/button';
import Spark from '../components/spark';

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
            title="For People"
        >
            <Title
                title="1"
                size={5}
                subtitle="Register your interests in the InCommon app"
            />
            <div style={{ margin: '1rem' }} />
            <Title
                title="2"
                size={5}
                subtitle="RSVP to meals that fit your schedule and budget"
            />
            <div style={{ margin: '1rem' }} />
            <Title
                title="3"
                size={5}
                subtitle="Tip your server"
            />
            <Spark url={'https://spark.adobe.com/video/NnfAON46L5sTa/embed'} />
            <Link href='/learn_more'>
                <Button>
                    Learn More
                </Button>
            </Link>
        </SideKick>
        <SideKick
            name={'events'}
            image={'/static/stage.jpg'}
            title={'For Communities'}
            justify={'right'}
        >
            <Title
                title="1"
                size={5}
                subtitle="Generate a unique InCommon interest code"
            />
            <Title
                title="2"
                size={5}
                subtitle="Share the code with your people"
            />
            <Title
                title="3"
                size={5}
                subtitle="Watch your community grow"
            />
            <p style={{ textAlign: 'center' }}>
                InCommon codes can relate to anything. From exclusive ticketed events to podcast interest groups, and everything in between.
            </p>
            <Spark url={'https://spark.adobe.com/video/gwkQg1WKcpTqW/embed'} />
            <Link href='/learn_more'>
                <Button>
                    Learn More
                </Button>
            </Link>
        </SideKick>
        <SideKick
            name={'restaurants'}
            image={'/static/reservation.jpg'}
            title="For Restaurants"
        >
            <Title
                title="1"
                size={5}
                subtitle="Notice an open table in your reservation book"
            />
            <Title
                title="2"
                size={5}
                subtitle="Generate an invite with the table capacity and time"
            />
            <Title
                title="3"
                size={5}
                subtitle="Split the check"
            />
            <Link href='/learn_more'>
                <Button>
                    Learn More
                </Button>
            </Link>
        </SideKick>
    </Fragment >
);

export default Index;