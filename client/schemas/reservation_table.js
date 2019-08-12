/* global location */
import Table from '../components/table';
import reservation_form from './reservation_form';

export default {
    label: 'Reservations',
    element: Table,
    props: {
        id: 'reservations',
        columns: [
            {
                label: 'id'
            }, {
                label: 'date'
            }, {
                label: 'capacity'
            }

        ],
        create: {
            ...reservation_form,
            submit_service_done() { location.reload(); }
        }
    }
};