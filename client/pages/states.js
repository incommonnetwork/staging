import React from 'react';

import Main from '../layouts/main';
import authMachine from '../state/auth.js';
import StateChart from '../utils/state-charts';

const States = () => (
    <Main>
        <StateChart machine={authMachine} withEditor={false} />
    </Main>
);

export default States;