/* global location */

import Table from '../components/table';

import neighborhoodForm from './neighborhood_form';

export default {
    label: 'Neighborhoods',
    element: Table,
    props: {
        id: 'neighborhoods',
        columns: [
            {
                label: 'id'
            }, {
                label: 'neighborhood'
            }, {
                label: 'latitude'
            }, {
                label: 'longitude'
            }
        ],
        create: {
            ...neighborhoodForm,
            submit_service_done: () => location.reload()
        }
    }
};