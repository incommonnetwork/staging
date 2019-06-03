import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';

import { useMachine } from '@xstate/react';
import protectedMachine from '../state/protected';


import Box from 'react-bulma-components/src/components/box';
import Loader from 'react-bulma-components/src/components/loader';

const Loading = () => (
    <NarrowColumn>
        <Box>
            <Loader />
        </Box>
    </NarrowColumn>
);


const Protected = ({ children, router, role }) => {
    const [current] = useMachine(protectedMachine.withContext({
        route: router.pathname,
        role
    }));


    return (
        <Main>
            {(current.matches('init') || current.matches('authorize')) ? (<Loading />) : children}
        </Main>
    );
};

Protected.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    router: PropTypes.object.isRequired,
    role: PropTypes.string
};

export default withRouter(Protected);