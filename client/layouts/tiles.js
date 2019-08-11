/* global */
import React from 'react';
import PropTypes from 'prop-types';

import { WideColumn } from './columns';
import Tile from 'react-bulma-components/src/components/tile';
import Card from '../layouts/card';

import { useMachine } from '@xstate/react';
import tileMachine from '../state/tiles';
import Loader from 'react-bulma-components/src/components/loader';
import Form from '../components/form';


const TileViewForm = ({ context }) => (
    <Form id={context.id} context={context} />
);

TileViewForm.propTypes = {
    context: PropTypes.object.isRequired
};

export { TileViewForm };

const TileView = ({ id, service, getQuery, Component, makeValues }) => {
    const [current] = useMachine(tileMachine.withContext({ id, service, getQuery, makeValues }));

    return (
        <WideColumn>
            <div id={`${id}_tiles`} style={{ marginTop: '2em' }}>
                <Tile kind="ancescor">
                    {current.context.values ? current.context.values.map((value_context, idx) => (
                        <Tile key={idx}>
                            <Card>
                                <Component context={value_context} />
                            </Card>
                        </Tile>
                    )) : <Loader />}
                </Tile>
            </div>
        </WideColumn >
    );
};

TileView.propTypes = {
    id: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    getQuery: PropTypes.func.isRequired,
    Component: PropTypes.func.isRequired,
    makeValues: PropTypes.func.isRequired

};

export default TileView;
