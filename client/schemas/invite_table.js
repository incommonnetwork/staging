/* global location */

import Table from '../components/table';

import inviteForm from './invite_form';

export default {
    label: 'Invites',
    element: Table,
    props: {
        id: 'invites',
        columns: [
            {
                label: 'id'
            }, {
                label: 'code'
            }, {
                label: 'date'
            }, {
                label: 'restaturant'
            }, {
                label: 'users'
            }
        ],
        create: {
            ...inviteForm,
            submit_service_done: () => location.reload()
        }
    }
};