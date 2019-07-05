/* global location */

import Table from '../components/table';

import cityForm from './city_form';

export default {
    label: 'Cities',
    element: Table,
    props: {
        id: 'cities',
        columns: [
            {
                label: 'id'
            }, {
                label: 'city'
            }, {
                label: 'state'
            }, {
                label: 'latitude'
            }, {
                label: 'longitude'
            }
        ],
        create: {
            ...cityForm,
            submit_service_done: () => location.reload()
        }
    }
};