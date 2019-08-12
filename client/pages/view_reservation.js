import React from 'react';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

import Form from '../components/form';
import formContext from '../schemas/view_reservation';

const context = {
    ...formContext,
    submit_service_done: () => { }
};

const ViewReservation = () => {


    return (
        <Main redirect="/sign_in">
            <NarrowColumn>
                <Card title={'View Reservation'}>
                    <Form context={context} id={'view reservation'} />
                </Card>
            </NarrowColumn>
        </Main>
    );
};

export default ViewReservation;