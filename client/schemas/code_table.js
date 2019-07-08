/* global location */
import Table from '../components/table';

import codeForm from './code_form';

export default {
    label: 'Codes',
    element: Table,
    props: {
        id: 'codes',
        columns: [
            {
                label: 'id'
            }, {
                label: 'assignedBy'
            }, {
                label: 'text'
            }
        ],
        create: {
            ...codeForm,
            submit_service_done: () => location.reload()
        }
    }
};