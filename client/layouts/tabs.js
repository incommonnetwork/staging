/* global location */
import React from 'react';
import PropTypes from 'prop-types';

import { WideColumn } from './columns';
import Tabs from 'react-bulma-components/src/components/tabs';

import { useMachine } from '@xstate/react';
import tabMachine from '../state/tabs';

const Tab = Tabs.Tab;

const TabsView = ({ tabs, id }) => {
    const [current, send] = useMachine(tabMachine.withContext({ active: location.hash ? location.hash.substr(1) : tabs[0].label, tabs }));
    const current_tab = tabs.filter(({ label }) => label === current.context.active)[0];
    const Element = current_tab.element;
    const props = current_tab.props;
    const current_id = current.context.active.toLowerCase().replace(' ', '_');

    return (
        <WideColumn>
            <div id={`${id}_tabs`} style={{ marginTop: '2em' }}>
                <Tabs
                    type='boxed'
                >
                    {tabs.map(({ label }) => (
                        <Tab
                            key={label}
                            onClick={() => (current.context.active != label) && (location.hash = label) && send({ type: 'TAB_SWITCH', label })}
                            active={current.context.active === label}
                        >
                            <div id={`${label.toLowerCase().replace(' ', '_')}_tab`}>
                                {label}
                            </div>
                        </Tab>
                    ))}
                </Tabs>
                <div id={`${current_id}_tab_content`}>
                    <Element key={current_id} id={current_id} {...props} />
                </div>
            </div>
        </WideColumn >
    );
};

TabsView.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string.isRequired
};

export default TabsView;
