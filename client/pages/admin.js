import React from 'react';
import Protected from '../layouts/protected';
import Tabs from '../layouts/tabs';
import Table from '../components/table';

const tabs = [
    {
        label: 'Users',
        element: Table,
        props: {
            id: 'users',
            columns: [
                {
                    label: 'id'
                }, {
                    label: 'email'
                }
            ]
        }
    }
];


const Home = () => {
    return (
        <Protected role="admin">
            <Tabs tabs={tabs} id="admin" />
        </Protected>
    );
};

export default Home;