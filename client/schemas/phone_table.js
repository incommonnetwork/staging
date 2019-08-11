/* global location */
import Table from '../components/table';

import codeForm from './phone_form';

export default {
    label: 'Phones',
    element: Table,
    props: {
        id: 'phones',
        columns: [
            {
                label: 'id'
            }, {
                label: 'number'
            }, {
                label: 'city'
            }
        ],
        create: {
            ...codeForm,
            submit_service_done: () => location.reload()
        }
    }
};