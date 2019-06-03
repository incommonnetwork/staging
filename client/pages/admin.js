import React from 'react';
import Protected from '../layouts/protected';
import Tabs from '../layouts/tabs';



const Users = () => (
    <p>users</p>
);

Users.propTypes = {};


const tabs = [
    {
        label: 'Users',
        element: Users
    }
];


const Home = () => {
    return (
        <Protected>
            <Tabs tabs={tabs} id="admin" />
        </Protected>
    );
};

export default Home;