import React from 'react';

import Protected from '../layouts/protected';
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
        <Protected redirect="/sign_in">
            <NarrowColumn>
                <Card title={'You\'re all Set!'}>
                    <Form context={context} id={'reservation'} />
                </Card>
            </NarrowColumn>
        </Protected>
    );
};

export default Rsvp;