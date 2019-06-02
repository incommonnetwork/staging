import React from 'react';
import PropTypes from 'prop-types';

import { WideColumn } from './columns';
import Card from './card';
import Tabs from 'react-bulma-components/src/components/tabs';

import { useMachine } from '@xstate/react';
import tabMachine from '../state/tabs';

const Tab = Tabs.Tab;

const TabsView = ({ tabs, id }) => {
    const [current, send] = useMachine(tabMachine.withContext({ active: tabs[0].label, tabs }));
    const Element = tabs.filter(({ label }) => label === current.context.active)[0].element;

    return (
        <WideColumn>
            <Card>
                <div id={`${id}_tabs`}>
                    <Tabs
                        type='boxed'
                        align='left'
                    >
                        {tabs.map(({ label }) => (
                            <Tab
                                key={label}
                                onClick={() => (current.context.active != label) && send({ type: 'TAB_SWITCH', label })}
                                active={current.context.active === label}
                            >
                                <div id={`${label.toLowerCase().replace(' ', '_')}_tab`}>
                                    {label}
                                </div>
                            </Tab>
                        ))}
                    </Tabs>
                    <div id={`${current.context.active.toLowerCase().replace(' ', '_')}_tab_content`}>
                        <Element />
                    </div>
                </div>
            </Card>
        </WideColumn>
    );
};

TabsView.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string.isRequired
};

export default TabsView;
