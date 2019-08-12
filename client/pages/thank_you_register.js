import React from 'react';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

const ThankYou = () => {
    return (
        <Main>
            <NarrowColumn>
                <Card>
                    {'Thank you for registering! we\'ll be in touch when InCommon is available in your area'}
                </Card>
            </NarrowColumn>
        </Main>
    );
};

export default ThankYou;