import React from 'react';

import { useMachine } from '@xstate/react';
import hashcodeMachine from '../state/hashcode';

const Hash = () => {
    useMachine(hashcodeMachine);

    return <div />;
};

export default Hash;