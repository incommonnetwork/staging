import React from 'react';
import PropTypes from 'prop-types';

import BulmaTable from 'react-bulma-components/src/components/table';

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
    const [current] = useMachine(tableMachine.withContext({ id }));

    return (
        <BulmaTable>
            <TableHeader columns={columns} />
            <TableBody columns={columns} data={current.context.page} />
        </BulmaTable>
    );
};

Table.propTypes = {
    id: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Table;