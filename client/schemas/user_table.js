/* global location */

import Table from '../components/table';

import userForm from './user_form';

export default {
    label: 'Users',
    element: Table,
    props: {
        id: 'users',
        columns: [
            {
                label: 'id'
            }, {
                label: 'email'
            }
        ],
        create: {
            ...userForm,
            submit_service_done: () => location.reload()
        }
    }
};