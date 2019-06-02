import React from 'react';
import PropTypes from 'prop-types';

import { WideColumn } from './columns.js';
import Card from 'react-bulma-components/src/components/card';
import Tabs from 'react-bulma-components/src/components/tabs';

import { useMachine } from '@xstate/react';
import tabMachine from '../state/tabs';

const Tab = Tabs.Tab;

const TabsView = ({ tabs }) => {
    const [current, send] = useMachine(tabMachine.withContext({ active: tabs[0].label, tabs }));
    const Element = tabs.filter(({ label }) => label === current.context.active)[0].element;

    return (
        <WideColumn>
            <Card style={{ padding: '2em', margin: '2em' }}>
                <Tabs
                    type='boxed'
                    align='left'
                //fullwidth={true}
                >
                    {tabs.map(({ label }) => (
                        <Tab
                            key={label}
                            onClick={() => (current.context.active != label) && send({ type: 'TAB_SWITCH', label })}
                            active={current.context.active === label}
                        >
                            {label}
                        </Tab>
                    ))}
                </Tabs>
                <Element />
            </Card>
        </WideColumn>
    );
};

TabsView.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.object)
};

export default TabsView;
