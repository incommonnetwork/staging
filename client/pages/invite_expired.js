import React from 'react';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

const ThankYou = () => {
    return (
        <Main>
            <NarrowColumn>
                <Card>
                    {'We\'re sorry, that invite has expired, stay tuned though, we\'ll try and send you another one soon'}
                </Card>
            </NarrowColumn>
        </Main>
    );
};

export default ThankYou;