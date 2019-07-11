import React from 'react';

import Protected from '../layouts/protected';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

import Form from '../components/form';
import formContext from '../schemas/rsvp_form';

const context = {
    ...formContext,
    submit_service_done: () => {
        // console.log('done');
    }
};

const Rsvp = () => {


    return (
        <Protected redirect="/sign_in">
            <NarrowColumn>
                <Card>
                    <Form context={context} id={'rsvp'} />
                </Card>
            </NarrowColumn>
        </Protected>
    );
};

export default Rsvp;