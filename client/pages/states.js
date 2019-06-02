import React from 'react';

import Main from '../layouts/main';
import form from '../state/form.js';
import auth from '../state/auth.js';
import tabs from '../state/tabs.js';
import protectedMachine from '../state/protected';

import StateChart from '../utils/state-charts';

const States = () => (
    <Main>
        <StateChart machine={form} withEditor={false} />
        <StateChart machine={auth} withEditor={false} />
        <StateChart machine={tabs} withEditor={false} />
        <StateChart machine={protectedMachine} withEditor={false} />
    </Main>
);

export default States;