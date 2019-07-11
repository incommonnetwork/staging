

import Table from '../components/table';

// import userForm from './user_form';

export default {
    label: 'Rsvps',
    element: Table,
    props: {
        id: 'rsvps',
        columns: [
            {
                label: 'id'
            }, {
                label: 'code'
            }, {
                label: 'user'
            }
        ]
    }
};