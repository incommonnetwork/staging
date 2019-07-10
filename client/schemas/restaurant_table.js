/* global location */
import Table from '../components/table';

import restaurantForm from './restaurant_form';

export default {
    label: 'Restaurants',
    element: Table,
    props: {
        id: 'restaurants',
        columns: [
            {
                label: 'id'
            }, {
                label: 'name'
            }, {
                label: 'address'
            }, {
                label: 'neighborhood'
            }
        ],
        create: {
            ...restaurantForm,
            submit_service_done: async () => {
                location.reload();
            }
        }
    }
};