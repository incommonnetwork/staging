
import React from 'react';
import Protected from '../layouts/protected';
import Tabs from '../layouts/tabs';

import adminTabs from '../schemas/admin_tabs';

const Home = () => {
    return (
        <Protected role="admin" redirect="/sign_in">
            <Tabs tabs={adminTabs} id="admin" />
        </Protected>
    );
};

export default Home;