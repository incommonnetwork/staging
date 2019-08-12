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
import Title from '../components/title';
import Link from '../components/link';
import Button from 'react-bulma-components/src/components/button';


const TileViewForm = ({ context }) => (
    <Form id={context.id} context={context} />
);

TileViewForm.propTypes = {
    context: PropTypes.object.isRequired
};

export { TileViewForm };

const TileView = ({ id, service, getQuery, Component, makeValues }) => {
    const [current] = useMachine(tileMachine.withContext({ id, service, getQuery, makeValues }));

    const values = current.context.values;

    return (
        <WideColumn>
            <div id={`${id}_tiles`} style={{ marginTop: '2em' }}>
                <Tile kind="ancestor">
                    {values ? values.length ? values.map((value_context, idx) => (
                        <Tile key={idx}>
                            <Card>
                                <Component context={value_context} />
                            </Card>
                        </Tile>
                    )) : <Tile>
                        <Card>
                            <Title size={3} title={'Full Table'} subtitle={'We\'re sorry, but there are no seats currently available. If you\'d like to get notified when InCommon runs another event near you, please click join our mailing list'} />
                            <div style={{ textAlign: 'center' }}>
                                <Link href='/learn_more'>
                                    <Button>
                                            Learn More
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </Tile>
                        : <Loader />}
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
