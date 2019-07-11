/* global location */
import Table from '../components/table';
import registration_form from './registration_form';

export default {
    label: 'Registrations',
    element: Table,
    props: {
        id: 'registrations',
        columns: [
            {
                label: 'id'
            }, {
                label: 'code'
            }, {
                label: 'user'
            }, {
                label: 'inviteId'
            }, {
                label: 'neighborhood'
            }
        ],
        create: {
            ...registration_form,
            submit_service_done() { location.reload(); }
        }
    }
};