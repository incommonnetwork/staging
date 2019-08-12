import React from 'react';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

const ThankYou = () => {
    return (
        <Main>
            <NarrowColumn>
                <Card>
                    {'Thank you for your RSVP! you\'ll receive a text message shortly with your confirmation.'}
                </Card>
            </NarrowColumn>
        </Main>
    );
};

export default ThankYou;