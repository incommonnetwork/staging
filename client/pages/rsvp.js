import React from 'react';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';
import Router from '../utils/router';

import Form from '../components/form';
import formContext from '../schemas/rsvp_form';

const context = {
    ...formContext,
    submit_service_done: () => {
        Router.push('/thank_you_rsvp');
    }
};

const Rsvp = () => {


    return (
        <Main redirect="/sign_in">
            <NarrowColumn>
                <Card title={'RSVP for Dinner'}>
                    <Form context={context} id={'rsvp'} />
                </Card>
            </NarrowColumn>
        </Main>
    );
};

export default Rsvp;