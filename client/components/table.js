import React from 'react';
import PropTypes from 'prop-types';

import BulmaTable from 'react-bulma-components/src/components/table';
import Loader from 'react-bulma-components/src/components/loader';
import BulmaPagination from 'react-bulma-components/src/components/pagination';

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

const TableBody = ({ columns, page }) => (

    <tbody>
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
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    page: PropTypes.object
};


const Table = ({ id, columns }) => {
    const [current, send] = useMachine(tableMachine.withContext({ id }));

    return (
        <div id={`${id}_table`}>
            <BulmaTable>
                <TableHeader columns={columns} />
                {current.matches('display') ? <TableBody columns={columns} page={current.context.page} /> : null}
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