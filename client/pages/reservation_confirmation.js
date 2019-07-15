import React from 'react';

import Protected from '../layouts/protected';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

import Form from '../components/form';
import formContext from '../schemas/reservation_confirmation';

const context = {
    ...formContext,
    submit_service_done: () => {
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