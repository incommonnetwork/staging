import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import BulmaTable from 'react-bulma-components/src/components/table';
import Loader from 'react-bulma-components/src/components/loader';
import BulmaPagination from 'react-bulma-components/src/components/pagination';
import Dropdown from 'react-bulma-components/src/components/dropdown';
import Level from 'react-bulma-components/src/components/level';
import { Input } from 'react-bulma-components/src/components/form';
import Button from 'react-bulma-components/src/components/button';

import { useMachine } from '@xstate/react';
import tableMachine from '../state/table.js';

const TableHeader = ({ columns }) => (
    <thead>
        <tr>
            {columns.map(({ label, abbr }) => (
                <th key={label}>
                    {abbr ? (<abbr title={label}>{abbr}</abbr>) : label}
                </th>
            ))}
        </tr>
    </thead>
);

TableHeader.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
};

const Pagination = ({ page, send }) => {
    const total = Math.ceil(page.total / page.limit);
    const current = (page.skip / page.limit) + 1;
    return (
        <BulmaPagination
            current={current}
            total={total}
            onChange={(target) => send({
                type: 'RELOAD',
                query: {
                    $skip: (target - 1) * page.limit
                }
            })}
        />
    );
};

Pagination.propTypes = {
    page: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired
};

const TableBody = ({ columns, page, id }) => (

    <tbody id={`${id}_table_body`} total={page.total}>
        {page.data.map((data) => (
            <tr key={data.id}>
                {columns.map(({ label }) => (
                    <td key={label}>
                        {data[label]}
                    </td>
                ))}
            </tr>
        ))}
    </tbody>
);

TableBody.propTypes = {
    id: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    page: PropTypes.object
};

const TableFilter = ({ columns, filter, send, id }) => (
    <Fragment>
        <Level>
            <div id={`${id}_filter_dropdown`}>
                <Dropdown
                    value={filter.field || 'Filter...'}
                    onChange={(selected) => send({
                        type: 'SELECT_FILTER',
                        filter: {
                            field: selected
                        }
                    })}
                >
                    {[{ label: 'Filter...' }, ...columns].map(({ label }) => (
                        <Dropdown.Item id={`${id}_${label}_selector`} key={label} value={label}>
                            {label}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            </div>
            {filter.field && (filter.field !== 'Filter...') ? <FilterInput id={id} filter={filter} send={send} /> : null}

        </Level>
    </Fragment>
);

TableFilter.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    id: PropTypes.string.isRequired,
    send: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired
};

const FilterInput = ({ id, filter, send }) => (
    <Fragment>
        <Input
            id={`${id}_filter`}
            placeholder="filter results"
            value={filter.value}
            onChange={({ target: { value } }) => send({
                type: 'UPDATE_FILTER',
                filter: {
                    field: filter.field,
                    value
                }
            })}
        />
        <Button id={`${id}_filter_submit`} color="primary" onClick={() => send('SUBMIT_FILTER')}>Filter</Button>
        <Button if={`${id}_filter_reset`} color="info" onClick={() => send('RESET_FILTER')}>Reset</Button>
    </Fragment>
);

FilterInput.propTypes = {
    id: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired
};

const Table = ({ id, columns }) => {
    const [current, send] = useMachine(tableMachine.withContext({ id }));

    return (
        <div id={`${id}_table`}>
            <Level>
                {current.matches('loading') ? <Loader /> : <TableFilter filter={current.context.filter || {}} columns={columns} id={id} send={send} />}
            </Level>
            <BulmaTable>
                <TableHeader columns={columns} />
                {current.matches('display') ? <TableBody id={id} columns={columns} page={current.context.page} /> : null}
            </BulmaTable>
            {current.matches('loading') ? <Loader /> : <Pagination page={current.context.page} id={id} send={send} />}
        </div>
    );
};

Table.propTypes = {
    id: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Table;