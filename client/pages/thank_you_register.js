import React from 'react';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

const ThankYou = () => {
    return (
        <Main>
            <NarrowColumn>
                <Card>
                    {'Thank you for registering! you\'ll receive an email shortly to confirm, and another when an invite is ready for one of your chosen dates.'}
                </Card>
            </NarrowColumn>
        </Main>
    );
};

export default ThankYou;