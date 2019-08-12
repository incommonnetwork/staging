/* global history */
import React from 'react';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';
import Button from 'react-bulma-components/src/components/button'

const RsvpError = () => {
    return (
        <Main>
            <NarrowColumn>
                <Card>
                    {'We\'re sorry, that reservation has filled, up. Please go back and select another'}
                    <Button onClick={() => history.back()}>
                        Go Back
                    </Button>
                </Card>
            </NarrowColumn>
        </Main>
    );
};

export default RsvpError;