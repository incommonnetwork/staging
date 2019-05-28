import React from 'react';

import Main from '../layouts/main';
import signUp from '../state/sign_up.js';
import StateChart from '../utils/state-charts';

const States = () => (
    <Main>
        <StateChart machine={signUp} withEditor={false} />
    </Main>
);

export default States;