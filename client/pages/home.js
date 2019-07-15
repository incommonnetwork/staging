
import React from 'react';
import Protected from '../layouts/protected';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

const Home = () => {
    return (
        <Protected redirect="/sign_in">
            <NarrowColumn>
                <Card>
                    {'The Best interface is no interface... InCommon operated entirely by your email.'}
                </Card>
            </NarrowColumn>
        </Protected>
    );
};

export default Home;